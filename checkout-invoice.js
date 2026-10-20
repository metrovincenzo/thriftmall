/* Thriftmall: WhatsApp checkout with a branded PNG invoice.
   Load AFTER the main script:  <script src="checkout-invoice.js"></script>
   It replaces only pay(sid). It uses these globals from index.html: users, cart, prods, me, usd, waNum, esc, toast, $.

   HONEST LIMITS (read before changing anything):
   - A wa.me link can open a chat and prefill TEXT. It can NEVER attach an image.
   - navigator.share({files}) can attach the PNG, but the phone's share sheet decides the chat,
     so the buyer must pick the seller there. We show the seller's name and number to reduce mistakes.
   - Nothing here can know whether the buyer actually sent the image. We never claim it was sent. */
(function () {
  'use strict';

  // ---------- styles and modal (created here so index.html needs only one script line) ----------
  var css = '.inv-img{display:block;width:100%;border:1px solid rgba(27,24,21,.22);margin:12px 0}' +
    '.inv-step{display:flex;gap:14px;margin:18px 0}' +
    '.inv-step>i{flex:none;width:30px;height:30px;border:1px solid #1b1815;display:grid;place-items:center;font-style:normal;font-family:Fraunces,Georgia,serif}' +
    '.inv-act{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}' +
    '.inv-st{font-size:.92rem;color:#6e1f26;min-height:1.5em;margin-top:6px}' +
    '.inv-note{font-size:.88rem;color:#5b5348}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var modal = document.createElement('div');
  modal.className = 'modal'; modal.id = 'invM';
  modal.innerHTML = '<div class="box" role="dialog" aria-modal="true" aria-label="Invoice"><button class="x" data-close aria-label="Close">&times;</button><div id="invBody"></div></div>';
  document.body.appendChild(modal);

  var S = null; // state of the invoice currently shown

  function orderRef() {
    return 'TM-' + Date.now().toString(36).toUpperCase().slice(-3) + Math.random().toString(36).toUpperCase().slice(2, 5);
  }

  // ---------- the invoice image ----------
  async function tmInvoiceCanvas(o) {
    try {
      await Promise.all([document.fonts.load('600 38px Fraunces'), document.fonts.load('400 18px "DM Sans"'), document.fonts.load('700 18px "DM Sans"')]);
    } catch (e) { /* fall back to system fonts */ }
    var SERIF = 'Fraunces,Georgia,serif', SANS = '"DM Sans",system-ui,sans-serif', W = 900, P = 48, SC = 1.5;
    var INK = '#1b1815', OX = '#6e1f26', IVORY = '#f4efe3', GOLD = '#e5cf9b', MUTE = '#5b5348', TAN = '#e8dcbc';
    var meas = document.createElement('canvas').getContext('2d');
    function wrap(ctx, text, font, maxW, maxLines) {
      ctx.font = font;
      var words = String(text).split(/\s+/), lines = [], cur = '';
      words.forEach(function (w) {
        var t = cur ? cur + ' ' + w : w;
        if (ctx.measureText(t).width <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; }
      });
      if (cur) lines.push(cur);
      if (maxLines && lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        var l = lines[maxLines - 1];
        while (l.length > 1 && ctx.measureText(l + '\u2026').width > maxW) l = l.slice(0, -1);
        lines[maxLines - 1] = l + '\u2026';
      }
      return lines;
    }
    function spaced(ctx, v) { try { ctx.letterSpacing = v; } catch (e) { /* unsupported: ignore */ } }
    function draw(x) {
      var y = 0, i;
      x.fillStyle = IVORY; x.fillRect(0, 0, W, 4000);
      // header band
      x.fillStyle = OX; x.fillRect(0, 0, W, 132);
      x.textBaseline = 'alphabetic'; x.textAlign = 'left';
      x.fillStyle = IVORY; x.font = '600 42px ' + SERIF; x.fillText('Thrift', P, 82);
      var tw = x.measureText('Thrift').width;
      x.fillStyle = GOLD; x.font = 'italic 600 42px ' + SERIF; x.fillText('mall', P + tw, 82);
      x.textAlign = 'right'; x.fillStyle = GOLD; x.font = '700 15px ' + SANS; spaced(x, '4px'); x.fillText('INVOICE', W - P, 60); spaced(x, '0px');
      x.fillStyle = IVORY; x.font = '600 22px ' + SERIF; x.fillText(o.ref, W - P, 92);
      // seller / date / buyer
      y = 180;
      x.textAlign = 'left'; x.fillStyle = MUTE; x.font = '700 12px ' + SANS; spaced(x, '2px');
      x.fillText('SELLER', P, y); x.fillText('DATE', 560, y); spaced(x, '0px');
      x.fillStyle = INK; x.font = '600 26px ' + SERIF;
      var shopL = wrap(x, o.shop, '600 26px ' + SERIF, 440, 2);
      for (i = 0; i < shopL.length; i++) x.fillText(shopL[i], P, y + 32 + i * 30);
      x.font = '500 19px ' + SANS; x.fillText(o.date, 560, y + 30);
      var ly = y + 32 + shopL.length * 30;
      if (o.loc) { x.fillStyle = MUTE; x.font = '400 17px ' + SANS; x.fillText(o.loc, P, ly - 4); ly += 22; }
      x.fillStyle = MUTE; x.font = '700 12px ' + SANS; spaced(x, '2px'); x.fillText('BUYER', 560, y + 76); spaced(x, '0px');
      x.fillStyle = INK; x.font = '500 19px ' + SANS; x.fillText(wrap(x, o.buyer, '500 19px ' + SANS, 290, 1)[0], 560, y + 104);
      y = Math.max(ly, y + 120) + 22;
      // double rule
      x.fillStyle = INK; x.fillRect(P, y, W - 2 * P, 1); x.fillRect(P, y + 4, W - 2 * P, 1); y += 36;
      // table head
      x.fillStyle = MUTE; x.font = '700 12px ' + SANS; spaced(x, '2px');
      x.textAlign = 'left'; x.fillText('ITEM', P, y); x.fillText('SIZE', 520, y); x.fillText('QTY', 640, y);
      x.textAlign = 'right'; x.fillText('PRICE', W - P, y); spaced(x, '0px'); y += 16;
      // rows
      o.items.forEach(function (it) {
        var lines = wrap(x, it.name, '600 20px ' + SANS, 440, 2);
        var h = Math.max(58, lines.length * 26 + 30);
        x.fillStyle = 'rgba(27,24,21,.2)'; x.fillRect(P, y, W - 2 * P, 1);
        x.fillStyle = INK; x.textAlign = 'left'; x.font = '600 20px ' + SANS;
        for (var k = 0; k < lines.length; k++) x.fillText(lines[k], P, y + 34 + k * 26);
        x.font = '400 19px ' + SANS; x.fillText(String(it.size), 520, y + 34); x.fillText(String(it.qty), 640, y + 34);
        x.textAlign = 'right'; x.font = '700 20px ' + SANS; x.fillText(o.fmt(it.price), W - P, y + 34);
        y += h;
      });
      x.fillStyle = 'rgba(27,24,21,.2)'; x.fillRect(P, y, W - 2 * P, 1); y += 40;
      // totals
      x.textAlign = 'left'; x.fillStyle = MUTE; x.font = '400 19px ' + SANS; x.fillText('Subtotal', 520, y);
      x.textAlign = 'right'; x.fillStyle = INK; x.font = '500 19px ' + SANS; x.fillText(o.fmt(o.total), W - P, y); y += 22;
      x.fillStyle = INK; x.fillRect(520, y, W - P - 520, 1); x.fillRect(520, y + 4, W - P - 520, 1); y += 48;
      x.textAlign = 'left'; x.fillStyle = MUTE; x.font = '700 13px ' + SANS; spaced(x, '2px'); x.fillText('TOTAL (US$)', 520, y - 8); spaced(x, '0px');
      x.textAlign = 'right'; x.fillStyle = OX; x.font = '600 40px ' + SERIF; x.fillText(o.fmt(o.total), W - P, y + 2); y += 50;
      // payment and delivery
      var instr = wrap(x, 'Pay ' + o.shop + ' directly. Agree the payment method, delivery and returns with the seller on WhatsApp, and confirm the items and total before you pay. All prices are in US dollars. Thriftmall is a platform and does not handle payments.', '400 17px ' + SANS, W - 2 * P - 48, 7);
      var bh = 64 + instr.length * 25;
      x.fillStyle = TAN; x.fillRect(P, y, W - 2 * P, bh);
      x.fillStyle = OX; x.fillRect(P, y, 4, bh);
      x.textAlign = 'left'; x.fillStyle = INK; x.font = '700 13px ' + SANS; spaced(x, '2px'); x.fillText('PAYMENT AND DELIVERY', P + 24, y + 34); spaced(x, '0px');
      x.font = '400 17px ' + SANS; x.fillStyle = INK;
      for (i = 0; i < instr.length; i++) x.fillText(instr[i], P + 24, y + 64 + i * 25);
      y += bh + 44;
      // footer
      x.textAlign = 'center'; x.fillStyle = MUTE; x.font = '400 15px ' + SANS;
      x.fillText('Thriftmall \u00b7 Zimbabwe thrift mall \u00b7 metrovincenzo.github.io/thriftmall', W / 2, y);
      return y + 40;
    }
    var H = Math.ceil(draw(meas));
    var c = document.createElement('canvas'); c.width = W * SC; c.height = H * SC;
    var x = c.getContext('2d'); x.scale(SC, SC); draw(x);
    return c;
  }
  window.tmInvoiceCanvas = tmInvoiceCanvas;

  // ---------- panel ----------
  function say(msg) { var el = document.getElementById('invSt'); if (el) el.textContent = msg; }
  function panel() {
    var o = S, body = document.getElementById('invBody'), num = '+' + waNum(o.wa);
    var head = '<h2>Your invoice</h2><p class="inv-note">' + esc(o.shop) + ' &middot; ' + esc(o.ref) + ' &middot; ' + usd(o.total) + '</p>';
    if (o.busy) { body.innerHTML = head + '<p>Creating your invoice&hellip;</p>'; return; }
    var n = 1, html = head;
    if (o.url) {
      html += '<img class="inv-img" src="' + o.url + '" alt="Invoice preview for ' + esc(o.shop) + '">' +
        '<div class="inv-step"><i>' + (n++) + '</i><div><b>Save the invoice image</b><div class="inv-act">' +
        '<a class="btn dark" id="invDl" href="' + o.url + '" download="' + esc(o.name) + '">Save image</a>' +
        (o.canShare ? '<button class="btn" data-inv="share">Share image</button>' : '') +
        (o.canCopy ? '<button class="btn" data-inv="copy">Copy image</button>' : '') + '</div>' +
        '<p class="inv-note">' + (o.canShare ? 'If you use Share, pick WhatsApp and then choose <b>' + esc(o.shop) + '</b> (' + esc(num) + ') yourself. Your phone, not Thriftmall, decides which chat the image goes to. ' : '') +
        'On an iPhone you can also press and hold the picture and choose Add to Photos.</p></div></div>';
    } else {
      html += '<section class="inv-text" style="margin:16px 0;padding:18px;border:1px solid rgba(27,24,21,.2);background:#f4efe3;color:#1b1815;border-radius:4px">' +
        '<div style="font-family:Fraunces,Georgia,serif;font-size:1.25rem;color:#6e1f26;font-weight:600">THRIFTMALL <span style="font-family:system-ui,sans-serif;font-size:.75rem;letter-spacing:.12em">ORDER INVOICE</span></div>' +
        '<div style="margin:8px 0 14px;font-size:.88rem;color:#5b5348">' + esc(o.ref) + ' &middot; ' + esc(o.date) + '</div>' +
        '<div><b>Seller</b>: ' + esc(o.shop) + (o.loc ? ' &middot; ' + esc(o.loc) : '') + '</div>' +
        '<div><b>Buyer</b>: ' + esc(o.buyer) + '</div>' +
        '<hr style="border:0;border-top:1px solid #d7cbb1;margin:14px 0">' +
        '<div style="display:grid;gap:9px">' + o.items.map(function (it) {
          return '<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><span>' + esc(it.name) +
            '<small style="display:block;color:#5b5348">Size: ' + esc(it.size) + ' &middot; Qty: ' + esc(it.qty) + '</small></span><b style="white-space:nowrap">' + esc(usd(it.price)) + '</b></div>';
        }).join('') + '</div><hr style="border:0;border-top:1px solid #d7cbb1;margin:14px 0">' +
        '<div style="display:flex;justify-content:space-between;gap:12px;font-size:1.1rem"><b>TOTAL (US$)</b><b style="color:#6e1f26">' + esc(usd(o.total)) + '</b></div>' +
        '<p style="font-size:.85rem;color:#5b5348;margin:14px 0 0">Please confirm the items, total, payment method and delivery with the seller before paying. Pay the seller directly; Thriftmall does not handle payments.</p>' +
        '</section><div class="inv-act"><button class="btn" data-inv="copy-text">Copy text invoice</button></div>' +
        '<p class="inv-note">The image could not be created on this device. This clean text invoice is your fallback—copy it and paste it into the seller chat.</p>';
    }
    html += '<div class="inv-step"><i>' + n + '</i><div><b>Open the chat with ' + esc(o.shop) + '</b> (' + esc(num) + ')' +
      '<div class="inv-act"><a class="btn dark" id="invChat" href="' + esc(o.chat) + '" target="_blank" rel="noopener">Open WhatsApp chat</a></div>' +
      '<p class="inv-note">' + (o.url ? 'In the chat, tap the paperclip (or +) and choose the saved invoice from Photos, Gallery or Files. ' : '') +
      'WhatsApp links can only prefill text. They cannot attach a picture, so please check the invoice is in the chat before you pay.</p></div></div>' +
      '<p class="inv-st" id="invSt" role="status" aria-live="polite"></p>';
    body.innerHTML = html;
  }

  // ---------- checkout ----------
  window.pay = async function pay(sid) {
    var s = users.find(function (u) { return u.id == sid; });
    var ps = cart.map(function (id) { return prods.find(function (p) { return p.id === id; }); }).filter(function (p) { return p && p.sid == sid; });
    if (!s || !ps.length) return;
    var number = waNum(s.wa);
    if (!/^\d{9,15}$/.test(number)) { toast('This seller has no valid WhatsApp number saved. Please ask them to update Shop Settings.'); return; }
    if (S && S.url) URL.revokeObjectURL(S.url);
    var total = ps.reduce(function (a, p) { return a + Number(p.price); }, 0);
    var ref = orderRef(), m = me(), buyer = m && m.type === 'buyer' ? m.name : 'Guest buyer';
    var lines = ps.slice(0, 4).map(function (p) { return '\u2022 ' + p.name + ' (' + (p.size || 'Size not specified') + ') ' + usd(p.price); });
    if (ps.length > 4) lines.push('+ ' + (ps.length - 4) + ' more');
    var text = 'Hi ' + s.shop + ', I would like to order on Thriftmall.\nRef: ' + ref + '\n' + lines.join('\n') + '\nTotal: ' + usd(total) +
      (buyer !== 'Guest buyer' ? '\nName: ' + buyer : '') + '\nI will send the invoice image next.';
    var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    var invoiceItems = ps.map(function (p) { return { name: p.name, size: p.size || 'Size not specified', qty: 1, price: Number(p.price) }; });
    var textInvoice = 'THRIFTMALL — ORDER INVOICE\n' + ref + ' | ' + date + '\nSeller: ' + s.shop +
      (s.loc ? ' | ' + s.loc : '') + '\nBuyer: ' + buyer + '\n\n' +
      invoiceItems.map(function (it) { return it.name + ' | Size: ' + it.size + ' | Qty: ' + it.qty + ' | ' + usd(it.price); }).join('\n') +
      '\n\nTOTAL (US$): ' + usd(total) +
      '\n\nPlease confirm items, total, payment method and delivery with the seller before paying. Pay the seller directly; Thriftmall does not handle payments.';
    S = { shop: s.shop, wa: s.wa, ref: ref, total: total, buyer: buyer, date: date, loc: s.loc || '', items: invoiceItems, textInvoice: textInvoice,
      busy: true, url: '', blob: null, name: 'Thriftmall-Invoice-' + ref + '.png',
      chat: 'https://wa.me/' + waNum(s.wa) + '?text=' + encodeURIComponent(text), canShare: false, canCopy: false };
    document.getElementById('cartM').classList.remove('show');
    document.getElementById('invM').classList.add('show');
    panel();
    var mine = S;
    try {
      var cv = await tmInvoiceCanvas({
        ref: ref, shop: s.shop, loc: s.loc || '', buyer: buyer, fmt: usd,
        date: date,
        items: invoiceItems, total: total
      });
      var blob = await new Promise(function (res, rej) { cv.toBlob(function (b) { b ? res(b) : rej(new Error('toBlob returned null')); }, 'image/png'); });
      if (S !== mine) return; // the buyer closed it or started another checkout
      S.blob = blob; S.url = URL.createObjectURL(blob);
      var f = new File([blob], S.name, { type: 'image/png' });
      S.canShare = !!(navigator.canShare && navigator.share && navigator.canShare({ files: [f] }));
      S.canCopy = !!(navigator.clipboard && window.ClipboardItem && window.isSecureContext);
    } catch (e) { console.error('Invoice image failed:', e); }
    if (S === mine) { S.busy = false; panel(); }
  };

  // Release the temporary PNG URL when the buyer closes the panel.
  function clearInvoice() {
    if (S && S.url) {
      try { URL.revokeObjectURL(S.url); } catch (e) { /* browser cleanup is best-effort */ }
    }
    S = null;
  }
  document.addEventListener('click', function (e) {
    if (e.target === modal || (e.target.closest && e.target.closest('#invM [data-close]'))) clearInvoice();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) clearInvoice();
  });

  // ---------- actions (each one is a direct tap, so browsers never block them) ----------
  document.addEventListener('click', async function (e) {
    var t = e.target.closest('#invDl,#invChat,[data-inv]');
    if (!t || !S) return;
    if (t.id === 'invDl') { say('Download started. Look in your Downloads or Files app. This does not send anything to the seller.'); return; }
    if (t.id === 'invChat') { say('The chat opens in a new tab or in WhatsApp. The invoice is NOT attached yet. Attach it there.'); return; }
    if (t.dataset.inv === 'share') {
      try {
        var f = new File([S.blob], S.name, { type: 'image/png' });
        await navigator.share({ files: [f], title: 'Thriftmall invoice ' + S.ref });
        say('Share finished. Please open WhatsApp and check the invoice is in the chat with ' + S.shop + '.');
      } catch (err) {
        say(err && err.name === 'AbortError' ? 'Sharing was cancelled. Nothing was sent.' : 'Sharing is not available here. Use Save image instead.');
      }
    }
    if (t.dataset.inv === 'copy') {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': S.blob })]);
        say('Image copied. In WhatsApp Web or Desktop, open the chat with ' + S.shop + ', click the message box and press Ctrl+V.');
      } catch (err) { say('Copying was blocked by this browser. Use Save image instead.'); }
    }
    if (t.dataset.inv === 'copy-text') {
      try {
        await navigator.clipboard.writeText(S.textInvoice);
        say('Text invoice copied. Open the chat with ' + S.shop + ' and paste it into the message box.');
      } catch (err) {
        say('Copying was blocked by this browser. Select and copy the invoice text above, then paste it into the seller chat.');
      }
    }
  });
})();