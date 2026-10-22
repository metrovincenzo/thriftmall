/* ===== EDIT THESE: community content shown on the Notice board, Events hall and Vlog lounge ===== */
const NEWS=[
 {d:'Market culture',t:'Vintage is how Zimbabwe thrifts',x:'From Harare to markets in Mutare and Victoria Falls, thrift clothing is an everyday way to dress well for less. Thriftmall brings finds from these sellers online.'},
 {d:'Community',t:'Curated thrift hits the runway',x:'Thrift & Threads, from the Mcheno and More platform, paired local designers with curated, cleaned secondhand retailers to change how bhero is seen.',u:'https://www.greedysouth.co.zw/2025/10/thrift-threads-new-dawn-for-sustainable.html',l:'Read the story'},
 {d:'Policy watch',t:'Used-clothing imports face a ban',x:'FairPlanet reported in June 2026 that government introduced a ban on importing used clothes in April, after bedbug concerns in some townships. Sellers: keep stock clean and check current rules.',u:'https://www.fairplanet.org/magazine/the-bedbugs-europe-sent-how-imported-used-clothes-are-infesting-zimbabwes-poorest-communities/',l:'Read the report'},
];
const EVENTS=[
 {t:'Avondale Flea Market, Harare',x:'A regular market near Avondale Shopping Centre with secondhand clothes, vinyl, jewellery and local art. Dates vary, so check before you go.',u:'https://thingstodoinzimbabwe.com/events/',l:'Event guide'},
 {t:'Mupedzanhamo, Mbare',x:'Zimbabwe\'s best-known secondhand clothes market. Go early for the best pick.',u:'https://www.newsday.co.zw/opinion-analysis/article/3979/feature-impoverished-zimbos-turn-to-used-clothes-as-economy-dips',l:'Read about it'},
 {t:'Thrift & Threads',x:'A recurring fashion and art event from Mcheno and More with runway shows, stalls and curated thrift. Follow them for the next date.',u:'https://www.zimsphere.co.zw/2025/11/thrift-and-threads-is-changing-the-face-of-zimbabwean-fashion.html',l:'Read the review'}
];
const VLOGS=[
 {t:'Thrifting in Mbare, Harare',by:'Thrift finds on TikTok',u:'https://www.tiktok.com/discover/thrifting-in-mbare-harare-zimbabwe'},
 {t:'Beginner\'s guide to flea market thrifting',by:'By Mcheno',k:'Read',u:'https://mcheno.co.zw/the-beginners-guide-to-thrifting-in-zimbabwe-how-to-make-the-most-out-of-your-trip-to-the-flea-market'},
 {t:'Share your thrift vlog',by:'Email us your link to be featured',k:'You',u:'mailto:chinyadzaeverton@gmail.com'}
];
const DOCS={
terms:`<h2>Terms of Use</h2><p class="by">Last updated 11 October 2026</p><div class="doc">
<h3>1. What Thriftmall is</h3><p>Thriftmall is a platform where independent sellers list vintage and thrifted items for buyers in Zimbabwe. We are not the seller. We do not handle payments, delivery or returns.</p>
<h3>2. Buying</h3><p>Prices are in US$ and set by sellers. Most pieces are one of a kind. Checkout opens WhatsApp so you can finish the sale with the seller. Confirm the item, price and delivery before you pay. Returns follow each seller's policy.</p>
<h3>3. Selling</h3><p>You must own or be allowed to sell what you list. Use honest photos, sizes, conditions and prices, and list clean items only. You are responsible for following Zimbabwean law, including import and customs rules, and for any taxes or licences that apply to your trade.</p>
<h3>4. Not allowed</h3><ul><li>Used undergarments (their sale is banned in Zimbabwe).</li><li>Stolen goods, or fakes sold as genuine brands.</li><li>Dirty, infested or unsafe items.</li><li>Illegal, misleading or abusive listings or messages.</li></ul>
<h3>5. Accounts</h3><p>Give accurate details and keep your password private. You are responsible for activity on your account. We may remove listings or accounts that break these terms.</p>
<h3>6. Your content</h3><p>You keep ownership of the photos and text you upload. You allow Thriftmall to display them on the site.</p>
<h3>7. Liability</h3><p>Thriftmall is provided as is. To the extent the law allows, we are not liable for disputes between buyers and sellers or for losses from transactions made through the site.</p>
<h3>8. Law and contact</h3><p>These terms are governed by the laws of Zimbabwe. Questions: chinyadzaeverton@gmail.com.</p></div>`,
privacy:`<h2>Privacy Policy</h2><p class="by">Last updated 11 October 2026</p><div class="doc">
<h3>Who we are</h3><p>Thriftmall is a platform for vintage and thrifted shops in Zimbabwe. Contact: chinyadzaeverton@gmail.com.</p>
<h3>What we collect</h3><ul><li>Buyers: full name, email and password, plus the categories and shops you follow and whether you want email updates.</li><li>Sellers: shop name, full name, location, WhatsApp number, email, password, shop logo, and product photos and details.</li><li>Your cart and the filters you use.</li></ul>
<h3>How we use it</h3><p>To run accounts, show shops and listings, open WhatsApp checkout with the right seller, and send buyers who created an account news, events and finds tailored to them. A seller's WhatsApp number is used so buyers can message them to complete a purchase.</p>
<h3>Where it is stored</h3><p>Accounts, shop details, listings and photos are stored with Supabase, our database and file storage provider. Passwords are handled by Supabase's login system and we never see them in plain text. Supabase's servers may be outside Zimbabwe. Your cart is kept in your own browser. A seller's shop name, location, WhatsApp number, logo and listings are public so buyers can shop and message them.</p>
<h3>Who sees it</h3><p>We do not sell personal data. At checkout your order goes to the seller through WhatsApp, and WhatsApp's own privacy terms apply. If you opt in to updates, your name and email are passed to Resend, our email provider, to send them. Fonts load from Google Fonts, which can see your IP address.</p>
<h3>Your rights</h3><p>Under Zimbabwe's Cyber and Data Protection Act [Chapter 12:07] you can ask to see, correct or delete your personal data. Email us and we will respond. You may also complain to POTRAZ, the Data Protection Authority.</p>
<h3>Security and children</h3><p>Use a unique password. Thriftmall is meant for adults aged 18 and over.</p>
<h3>Changes</h3><p>We will post updates on this page with a new date.</p></div>`
};
/* ================================================================================================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.addEventListener('error', e => { const img=e.target; if (img instanceof HTMLImageElement && img.classList.contains('product-photo')) { img.hidden=true; img.parentElement?.classList.add('photo-missing'); } }, true);
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}};
const store=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{toast('Storage is full. Remove a product or use smaller photos.');return false}};
let users=[],prods=[],cart=load('tm_cart',[]),meId=null,sb=null;
let shopFilter=null,photo=null,logoTmp=null,mode='login',acct='buyer';
let authMethod='email', pendingAuth=null, phoneOtpChannel='sms';
const me=()=>users.find(u=>u.id===meId)||null;
const usd=n=>'US$'+Number(n).toFixed(2);
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display='none',2800)}
function shrink(file,max=700){return new Promise((res,rej)=>{if(!file||!file.type.startsWith('image/'))return rej();const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const s=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.78))};i.onerror=rej;i.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}
const waNum=n=>{const raw=String(n??'').trim();let d=raw.replace(/\D/g,'');if(raw.startsWith('00'))d=d.slice(2);if(d.startsWith('2630'))d='263'+d.slice(4);else if(!raw.startsWith('+')&&!raw.startsWith('00')&&d.startsWith('0'))d='263'+d.slice(1);return d};

const cardHTML=p=>{const s=users.find(u=>u.id===p.sid);const inC=cart.includes(p.id);const photo=safeImageUrl(p.img);return `<article class="card"><div class="ph" role="img" aria-label="${esc(p.name)}">${photo?`<img class="product-photo" src="${esc(photo)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:''}</div><div class="b"><span class="no">No. ${String(p.id).padStart(3,'0')}</span><h3>${esc(p.name)}</h3><div class="meta"><span class="tag c">${esc(p.cat)}</span><span class="tag">Size ${esc(p.size)}</span><span class="tag">${esc(p.cond)}</span><span class="tag av">Available</span></div><div class="by">${s?esc(s.shop)+', '+esc(s.loc):''}</div><div class="row"><span class="price">${usd(p.price)}</span><button class="mini${inC?' in':''}" data-cart="${p.id}">${inC?'In cart':'Add to cart'}</button></div></div></article>`}
function render(){
  const sellers=users.filter(u=>u.type==='seller');
  $('#shopList').innerHTML=sellers.length?sellers.map(s=>`<button class="store${shopFilter===s.id?' on':''}" data-shop="${s.id}"><div class="awn"></div><div class="lg" style="${safeImageCss(s.logo)}">${s.logo?'':esc(s.shop[0]||'?')}</div><b>${esc(s.shop)}</b><span>${esc(s.loc)}</span></button>`).join(''):'<div class="empty" style="grid-column:1/-1">No shops yet. Be the first to open one.</div>';
  const sizes=[...new Set(prods.map(p=>p.size))].sort();const cur=$('#fs').value;
  $('#fs').innerHTML='<option value="">All sizes</option>'+sizes.map(s=>`<option${s===cur?' selected':''}>${esc(s)}</option>`).join('');
  const q=$('#q').value.toLowerCase(),c=$('#fc').value,z=$('#fs').value;
  const list=prods.filter(p=>(!shopFilter||p.sid===shopFilter)&&(!c||p.cat===c)&&(!z||p.size===z)&&(!q||(p.name+p.cat).toLowerCase().includes(q))).reverse();
  $('#prods').innerHTML=list.length?list.map(cardHTML).join(''):`<div class="empty">${shopFilter||q||c||z?'Nothing matches. Clear your filters to see more.':'The racks are empty. Sellers: open a shop and add your first piece.'}</div>`;
  const mm=me(),fl=(mm&&mm.follows)||[],fy=mm&&mm.type==='buyer'&&fl.length?prods.filter(p=>fl.includes('cat:'+p.cat)||fl.includes('shop:'+p.sid)).reverse().slice(0,4):[];
  $('#foryou').hidden=!fy.length;$('#fy').innerHTML=fy.map(cardHTML).join('');if(mm)$('#fyh').textContent='Picked for you, '+mm.name.split(' ')[0];
  const fr=prods.slice(-8).reverse();$('#fresh-s').hidden=!fr.length;$('#fresh').innerHTML=fr.map(cardHTML).join('');
  $('#colls').innerHTML=['Clothing','Accessories','Rare Finds'].map(c=>{const it=prods.filter(p=>p.cat===c).reverse().slice(0,4);return it.length?`<div class="coll"><div class="ch"><h3>${c}</h3><button class="tl" data-cat="${c}">View all</button></div><div class="g4">${it.map(cardHTML).join('')}</div></div>`:''}).join('');$('#colls-s').hidden=!$('#colls').innerHTML;
  $('#notes').innerHTML=NEWS.map(n=>`<div class="note"><div class="d">${esc(n.d)}</div><h3>${esc(n.t)}</h3><p>${esc(n.x)}</p>${n.u?`<p><a class="link" href="${esc(n.u)}" target="_blank" rel="noopener">${esc(n.l||'Read more')}</a></p>`:''}</div>`).join('');
  $('#evs').innerHTML=EVENTS.map(e=>`<div class="ticket"><div class="dt">${e.day?`<span>${esc(e.m)}</span><b>${esc(e.day)}</b>`:`<span>Regular</span><b>&#8635;</b>`}</div><div class="tx"><h3>${esc(e.t)}</h3><p>${esc(e.x)}</p>${e.u?`<p><a class="link" href="${esc(e.u)}" target="_blank" rel="noopener">${esc(e.l||'Details')}</a></p>`:''}</div></div>`).join('');
  $('#vls').innerHTML=VLOGS.map(v=>`<a class="vlog"${v.u&&v.u!=='#'?` href="${esc(v.u)}" target="_blank" rel="noopener"`:''}><div class="th" aria-hidden="true" style="font-size:${v.k?'1.3rem':'2rem'}">${v.k?esc(v.k):'&#9654;'}</div><div class="t"><b>${esc(v.t)}</b><span>${esc(v.by)}</span></div></a>`).join('');
  if(window.__ld)cart=cart.filter(id=>prods.some(p=>p.id===id));$('#cnt').textContent=cart.length;
  $('#accBtn').textContent=me()?(me().type==='seller'?me().shop:me().name.split(' ')[0]):'Account';
}

/* ---- Cart & checkout: one WhatsApp order per shop ---- */
function openCart(){
  const items=cart.map(id=>prods.find(p=>p.id===id)).filter(Boolean);
  if(!items.length){$('#cartBody').innerHTML='<p>Your cart is empty. Every piece is one of a kind, so add yours before someone else does.</p>'}
  else{
    const by={};items.forEach(p=>(by[p.sid]=by[p.sid]||[]).push(p));
    $('#cartBody').innerHTML=Object.keys(by).map(sid=>{const s=users.find(u=>u.id==sid),ps=by[sid],t=ps.reduce((a,p)=>a+Number(p.price),0);
      return `<div class="cg"><h3>${esc(s?s.shop:'Shop')}</h3>${ps.map(p=>`<div class="ci"><span>${esc(p.name)} (${esc(p.size)})</span><span>${usd(p.price)} <button class="link" data-rm="${p.id}">Remove</button></span></div>`).join('')}<div class="ci"><b>Subtotal</b><b>${usd(t)}</b></div><button class="btn dark full" data-pay="${sid}">Checkout with ${esc(s?s.shop:'seller')}</button></div>`}).join('')+`<p class="by">You pay each seller directly. Checkout opens WhatsApp with your order ready to send. Agree payment, delivery and returns with the seller.</p>`;
  }
  $('#cartM').classList.add('show');
}
function buildInvoiceCanvas({s,ps,buyerName,orderRef,date,subtotal}){
  const scale=2,w=900,pad=46,headerH=190,detailsH=174,itemsHeadH=64,rowH=112,totalsH=160,paymentH=132,footerH=100;
  const h=headerH+detailsH+itemsHeadH+ps.length*rowH+totalsH+paymentH+footerH+pad*2;
  const canvas=document.createElement('canvas');canvas.width=w*scale;canvas.height=h*scale;
  const ctx=canvas.getContext('2d');ctx.scale(scale,scale);
  const green='#073f35',green2='#0b5144',gold='#c49b52',paper='#f7f1e4',ink='#12332e',muted='#59655c',line='#d7cebb';
  const round=(x,y,rw,rh,rad,fill)=>{ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,rw,rh,rad);ctx.fill()};
  const text=(t,x,y,size=18,color=ink,font='Arial',weight='normal',align='left')=>{ctx.fillStyle=color;ctx.font=weight+' '+size+'px '+font;ctx.textAlign=align;ctx.fillText(String(t),x,y)};
  const fit=(t,max,size=18)=>{let v=String(t||'');ctx.font='bold '+size+'px Arial';while(ctx.measureText(v).width>max&&v.length>3)v=v.slice(0,-2)+'…';return v};
  ctx.fillStyle=paper;ctx.fillRect(0,0,w,h);
  round(0,0,w,headerH,0,green);
  ctx.fillStyle='#124e41';ctx.fillRect(0,headerH-12,w,12);
  ctx.strokeStyle=gold;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(58,86);ctx.quadraticCurveTo(100,34,142,86);ctx.lineTo(160,112);ctx.quadraticCurveTo(100,142,40,112);ctx.closePath();ctx.stroke();
  text('ThriftMall',190,86,50,'#fff7e8','Georgia','bold');
  text('PRE-LOVED  •  UNIQUE  •  SUSTAINABLE',194,119,16,'#e7d8b8','Arial','bold');
  text('Good style doesn’t',w-42,66,22,'#e9bd6a','Georgia','normal','right');
  text('go to waste.',w-42,96,22,'#e9bd6a','Georgia','normal','right');
  let y=headerH+24;
  round(28,y,w-56,detailsH-18,16,'#fffdf6');
  round(48,y+18,300,42,10,green);
  text('ORDER SUMMARY',68,y+47,22,'#fffdf6','Arial','bold');
  text('Order reference',54,y+91,16,muted);
  text(orderRef,54,y+120,23,ink,'Arial','bold');
  text('Order date',54,y+148,16,muted);
  text(date,166,y+148,17,ink,'Arial','bold');
  ctx.strokeStyle=line;ctx.beginPath();ctx.moveTo(425,y+22);ctx.lineTo(425,y+detailsH-38);ctx.stroke();
  text('SOLD BY',454,y+46,15,muted,'Arial','bold');
  text(fit(s.shop||s.name||'ThriftMall',360,28),454,y+78,28,ink,'Georgia','bold');
  text('Order placed via ThriftMall marketplace',454,y+108,15,muted);
  text('WhatsApp order • Confirm delivery with seller',454,y+137,14,ink);
  y+=detailsH;
  round(28,y,w-56,itemsHeadH+ps.length*rowH+14,14,'#fffdf7');
  round(46,y+12,260,40,9,green2);
  text('ITEMS ORDERED',64,y+39,20,'#fffdf7','Arial','bold');
  const cols={no:64,item:112,size:530,qty:620,price:710,total:830};
  y+=itemsHeadH;
  round(46,y-1,w-92,32,6,'#ece7d9');
  text('#',cols.no,y+21,14,ink,'Arial','bold');
  text('ITEM',cols.item,y+21,14,ink,'Arial','bold');
  text('SIZE',cols.size,y+21,14,ink,'Arial','bold');
  text('QTY',cols.qty,y+21,14,ink,'Arial','bold','center');
  text('UNIT PRICE',cols.price,y+21,14,ink,'Arial','bold','center');
  text('TOTAL',cols.total,y+21,14,ink,'Arial','bold','right');
  y+=40;
  ps.forEach((p,i)=>{
    ctx.strokeStyle=line;ctx.beginPath();ctx.moveTo(48,y+rowH-5);ctx.lineTo(w-48,y+rowH-5);ctx.stroke();
    text(String(i+1),cols.no,y+42,18,ink);
    text(fit(p.name,390,19),cols.item,y+32,19,ink,'Georgia','bold');
    text('Pre-loved find',cols.item,y+57,14,muted);
    text(p.size||'—',cols.size,y+42,17,ink);
    text('1',cols.qty,y+42,17,ink,'Arial','normal','center');
    text(usd(p.price),cols.price,y+42,17,ink,'Arial','normal','center');
    text(usd(p.price),cols.total,y+42,17,ink,'Arial','bold','right');
    y+=rowH;
  });
  y+=12;round(46,y,w-92,totalsH-10,12,'#eeeade');
  text('Subtotal',w-360,y+34,17,ink);
  text(usd(subtotal),w-68,y+34,18,ink,'Arial','bold','right');
  text('Delivery',w-360,y+65,17,ink);
  text('To be confirmed',w-68,y+65,16,muted,'Arial','normal','right');
  round(w-430,y+82,362,48,9,green);
  text('TOTAL',w-408,y+113,21,'#fffdf6','Arial','bold');
  text(usd(subtotal),w-88,y+113,24,'#fffdf6','Arial','bold','right');
  y+=totalsH;
  round(46,y,w-92,paymentH-8,12,'#eeeade');
  text('PAYMENT & DELIVERY',70,y+36,20,green,'Arial','bold');
  text('Please confirm item availability, delivery cost and payment method',70,y+66,15,ink);
  text('with the seller before making payment.',70,y+90,15,ink);
  y+=paymentH;
  round(0,y,w,footerH,0,green);
  text('Thank you for shopping with ThriftMall!',34,y+40,20,'#f5d79b','Georgia','bold');
  text('Supporting pre-loved fashion and independent sellers.',34,y+69,15,'#fffdf6');
  text('ORDER REQUEST • NOT PROOF OF PAYMENT',w-30,y+54,13,'#e8d8b7','Arial','bold','right');
  return canvas;
}
function pay(sid){
  const s=users.find(u=>u.id==sid),ps=cart.map(id=>prods.find(p=>p.id===id)).filter(p=>p&&p.sid==sid);
  if(!s||!ps.length)return toast('Your seller or cart items could not be found. Refresh and try again.');
  const number=waNum(s.wa);
  if(!number||number.length<8||number.length>15)return toast('This seller has no valid WhatsApp number saved. Please contact the seller or ask them to update Shop Settings.');
  const buyerAccount=me()&&me().type==='buyer'?me():null;
  const now=new Date();
  const date=now.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  const orderRef='TM-'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+'-'+Math.random().toString(36).slice(2,7).toUpperCase();
  const subtotal=ps.reduce((a,p)=>a+Number(p.price||0),0);
  const lines=ps.map((p,i)=>(String(i+1)+'. '+p.name+' — '+(p.size||'Size not specified')+' — '+usd(p.price))).join('\n');
  const msg='Hi '+s.shop+', I would like to order from ThriftMall.\nOrder: '+orderRef+'\n'+lines+'\nTotal: '+usd(subtotal)+'\nPlease confirm availability, delivery cost and payment method. I will attach the order invoice image if it downloads successfully.';
  const url='https://wa.me/'+number+'?text='+encodeURIComponent(msg);
  const canvas=buildInvoiceCanvas({s,ps,buyerName:buyerAccount&&buyerAccount.name,orderRef,date,subtotal});
  // Open the seller-specific chat immediately from the checkout tap.
  try{
    const popup=window.open(url,'_blank');
    if(!popup)window.location.assign(url);
  }catch(error){
    console.error('Could not open WhatsApp checkout:',error);
    window.location.assign(url);
  }
  // Download the designed invoice separately. WhatsApp wa.me links cannot attach files automatically.
  try{
    canvas.toBlob(blob=>{
      if(!blob){
        toast('Seller chat opened. The invoice image could not be generated; the short order summary is in the chat.');
        return;
      }
      const imageUrl=URL.createObjectURL(blob);
      const link=document.createElement('a');
      link.href=imageUrl;
      link.download='ThriftMall-'+orderRef+'.png';
      link.style.display='none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(()=>URL.revokeObjectURL(imageUrl),60000);
      toast('Seller chat opened. If your phone does not save the invoice automatically, use your browser download prompt and attach the image in WhatsApp.');
    },'image/png');
  }catch(error){
    console.warn('Invoice image download unavailable:',error);
    toast('Seller chat opened with a short order summary. The invoice image may need to be saved separately.');
  }
}

/* ---- Account ---- */
function accView() {
  // Phone OTP delivery requires an external messaging provider; keep new registrations email-only for now.
  if (mode === 'signup') authMethod = 'email';
  const u = me(), b = $('#accBody');
  const security = `<section style="border-top:1px solid var(--rule);margin-top:22px;padding-top:18px">
    <h3 style="font-size:1.1rem;margin-bottom:8px">Account security</h3>
    <p class="by" style="margin-bottom:12px">Choose a strong password you don't use elsewhere.</p>
    <div class="f"><label for="changeNewPassword">New password</label><input id="changeNewPassword" type="password" autocomplete="new-password" minlength="8"></div>
    <div class="f"><label for="changeConfirmPassword">Confirm new password</label><input id="changeConfirmPassword" type="password" autocomplete="new-password" minlength="8"></div>
    <button class="btn full" id="changePassword">Change password</button>
  </section>`;
  if (mode === 'verify') {
    const a = pendingAuth;
    if (!a) { mode = 'login'; return accView(); }
    const label = a.method === 'email' ? 'email address' : 'phone number';
    const verb = a.intent === 'signup' ? 'finish creating your account' : 'confirm your identity to reset your password';
    b.innerHTML = `<h2>Check your ${label}</h2>
      <p class="by" style="margin-bottom:16px">Enter the 6-digit code sent to <b>${esc(a.identifier)}</b> to ${verb}.</p>
      <div class="f"><label for="otpCode">Verification code</label><input id="otpCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="000000"></div>
      <button class="btn dark full" id="verifyOtp">Verify code</button>
      <p style="text-align:center;margin-top:14px"><button class="link" id="resendOtp">Send a new code</button></p>
      <p style="text-align:center;margin-top:8px"><button class="link" id="backLogin">Back to log in</button></p>`;
    return;
  }
  if (mode === 'forgot') {
    b.innerHTML = `<h2>Recover your account</h2>
      <p class="by" style="margin-bottom:16px">We'll send a one-time code to a contact method linked to your account.</p>
      ${mode === 'signup' ? '<div class="seg"><button data-method="email" class="on">Email</button></div>' : `<div class="seg"><button data-method="email" class="${authMethod === 'email' ? 'on' : ''}">Email</button><button data-method="phone" class="${authMethod === 'phone' ? 'on' : ''}">Phone</button></div>`}
    ${authMethod === 'phone' && mode !== 'login' ? '<p class="by" style="margin:-6px 0 8px">Send verification code by</p><div class="seg"><button data-phone-channel="sms">SMS</button><button data-phone-channel="whatsapp">WhatsApp</button></div>' : ''}
      <div class="f"><label for="identifier">${authMethod === 'email' ? 'Email address' : 'Phone number with country code'}</label><input id="identifier" type="${authMethod === 'email' ? 'email' : 'tel'}" autocomplete="${authMethod === 'email' ? 'email' : 'tel'}" placeholder="${authMethod === 'email' ? 'you@example.com' : '+263 77 123 4567'}"></div>
      <button class="btn dark full" id="sendRecovery">Send recovery code</button>
      <p class="by" style="margin-top:12px">For phone recovery, your number must already be registered and phone OTP must be enabled.</p>
      <p style="text-align:center;margin-top:12px"><button class="link" id="backLogin">Back to log in</button></p>`;
    syncPhoneChannelButtons(b);
    return;
  }
  if (mode === 'reset') {
    b.innerHTML = `<h2>Choose a new password</h2>
      <p class="by" style="margin-bottom:16px">Your contact method has been verified. Choose a password with at least 8 characters.</p>
      <div class="f"><label for="newPassword">New password</label><input id="newPassword" type="password" autocomplete="new-password" minlength="8"></div>
      <div class="f"><label for="confirmPassword">Confirm new password</label><input id="confirmPassword" type="password" autocomplete="new-password" minlength="8"></div>
      <button class="btn dark full" id="setPassword">Save new password</button>`;
    return;
  }

  if (u && u.type === 'seller') {
    const mine = prods.filter(p => p.sid === u.id);
    const clothing = mine.filter(p => p.cat === 'Clothing').length;
    const accessories = mine.filter(p => p.cat === 'Accessories').length;
    const rare = mine.filter(p => p.cat === 'Rare Finds').length;
    photo = null;
    b.innerHTML = `<div class="tm-sd">
      <header class="tm-sd-head">
        <div><div class="eyebrow">Seller workspace</div><h2>${esc(u.shop || 'Your shop')}</h2><p>Manage your listings, keep your shop details current, and add new finds.</p><p class="by" style="margin-top:5px">${esc(u.name)}, ${esc(u.loc || '')}</p></div>
        <button class="btn dark" id="sdAddJump" type="button">＋ Add product</button>
      </header>
      <div class="tm-sd-kpis" aria-label="Listing overview">
        <div class="tm-sd-kpi"><span>Total listings</span><strong>${mine.length}</strong></div>
        <div class="tm-sd-kpi"><span>Clothing</span><strong>${clothing}</strong></div>
        <div class="tm-sd-kpi"><span>Accessories</span><strong>${accessories}</strong></div>
        <div class="tm-sd-kpi"><span>Rare finds</span><strong>${rare}</strong></div>
      </div>
      <div class="tm-sd-layout">
        <section class="tm-sd-panel" id="sdCatalog">
          <div class="tm-sd-panel-head"><div><h3>Your products</h3><p>Every listing in one place. Search and filter to find an item quickly.</p></div><span class="tm-sd-status">${mine.length} listed</span></div>
          <div class="tm-sd-tools"><input id="sellerSearch" type="search" placeholder="Search your products…" aria-label="Search your products"><select id="sellerCategory" aria-label="Filter by category"><option value="">All categories</option><option>Clothing</option><option>Accessories</option><option>Rare Finds</option></select><select id="sellerSort" aria-label="Sort products"><option value="newest">Newest first</option><option value="name">Name A–Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div>
          <div class="tm-sd-list" id="sellerListings">
            ${mine.length ? mine.slice().reverse().map(p => `<article class="tm-sd-product" data-seller-row data-name="${esc(p.name).toLowerCase()}" data-category="${esc(p.cat)}" data-price="${Number(p.price)||0}" data-created="${p.id}">
              <div class="tm-sd-thumb" style="${safeImageCss(p.img)}" role="img" aria-label="${esc(p.name)}"></div>
              <div class="tm-sd-product-main"><div class="tm-sd-product-name">${esc(p.name)}</div><div class="tm-sd-product-meta">Size ${esc(p.size)} · ${esc(p.cond)}</div></div>
              <div class="tm-sd-category"><span class="tm-sd-cell-label">Category</span>${esc(p.cat)}</div>
              <div class="tm-sd-condition"><span class="tm-sd-cell-label">Condition</span>${esc(p.cond)}</div>
              <div class="tm-sd-product-price"><span class="tm-sd-cell-label">Price</span><span class="tm-sd-price">${usd(p.price)}</span></div>
              <div class="tm-sd-product-actions"><span class="tm-sd-status">Listed</span><button class="tm-sd-delete" data-edit="${p.id}" aria-label="Edit details for ${esc(p.name)}">Edit details</button><button class="tm-sd-delete" data-edit-photo="${p.id}" aria-label="Change photo for ${esc(p.name)}">Change photo</button><button class="tm-sd-delete" data-del="${p.id}" aria-label="Delete ${esc(p.name)}">Delete</button></div>
            </article>`).join('') : '<div class="tm-sd-empty"><h3>No products yet</h3><p>Add your first thrift find using the form beside this list. Your listings will appear here.</p></div>'}
          </div>
          <p class="by" id="sellerNoResults" hidden style="padding:20px 0">No products match those filters. Try a different search.</p>
        </section>
        <aside>
          <section class="tm-sd-panel tm-sd-form" id="sdAddForm">
            <div class="tm-sd-panel-head"><div><h3>Add a product</h3><p>Clear details help buyers decide faster.</p></div></div>
            <div class="f"><div class="drop" id="drop"><b>Drag a photo here or tap to upload</b><br><small>JPEG, PNG or WebP · From your phone or computer</small><img class="prev" id="pv" hidden alt="Product preview"></div><input type="file" id="pin" accept="image/jpeg,image/png,image/webp" hidden></div>
            <div class="f"><label for="pn">Product name</label><input id="pn" maxlength="120" placeholder="e.g. 90s Levi's denim jacket"></div>
            <div class="two"><div class="f"><label for="pp">Price (US$)</label><input id="pp" type="number" min="0" step="0.01" placeholder="0.00"></div><div class="f"><label for="ps">Size</label><input id="ps" placeholder="M, 32, UK 8"></div></div>
            <div class="two"><div class="f"><label for="pc">Condition</label><select id="pc"><option>Like new</option><option>Good</option><option>Fair, well loved</option><option>Needs repair</option></select></div><div class="f"><label for="pk">Category</label><select id="pk"><option>Accessories</option><option>Clothing</option><option>Rare Finds</option></select></div></div>
            <button class="btn dark full" id="addP">Add to ThriftMall</button>
            <p class="by" style="margin-top:10px">Use a real photo and describe the item's condition accurately.</p>
          </section>
        </aside>
      </div>
      <section class="tm-sd-panel tm-sd-settings">
        <h3>Shop settings</h3><p class="by" style="margin-bottom:18px">These details appear to buyers on ThriftMall.</p>
        <div class="tm-sd-layout">
          <div>
            <div class="f"><label for="profileName">Your name</label><input id="profileName" value="${esc(u.name || '')}" autocomplete="name"></div>
            <div class="f"><label for="profileShop">Shop name</label><input id="profileShop" value="${esc(u.shop || '')}" autocomplete="organization"></div>
            <div class="two"><div class="f"><label for="profileLocation">Location</label><input id="profileLocation" value="${esc(u.loc || '')}" placeholder="Harare, Avondale"></div><div class="f"><label for="profileWhatsApp">Public WhatsApp</label><input id="profileWhatsApp" type="tel" value="${esc(u.wa || '')}" placeholder="+263 77 123 4567"></div></div>
            <p class="by" style="margin-bottom:12px">Your login phone number and public WhatsApp contact are separate.</p><button class="btn dark" id="saveProfile">Save shop settings</button>
          </div>
          <div><div class="sw"><div class="lg" id="lgPrev" style="${safeImageCss(u.logo)}"></div><div><b>Shop logo or photo</b><br><button class="link" id="lgBtn">Upload or change image</button><input type="file" id="lgIn" accept="image/jpeg,image/png,image/webp" hidden></div></div><p class="by">A clear shop image helps buyers recognise your store.</p></div>
        </div>
      </section>
      <section class="tm-sd-panel" style="margin-top:18px;border:1px solid #e8caca">
        <h3>Delete account</h3>
        <p class="by">Permanently remove your seller account, active listings, shop profile, preferences and uploaded shop/product photos. This cannot be undone.</p>
        <button class="btn" id="deleteAccount" style="border:1px solid #b42318;color:#b42318;background:transparent">Delete my account</button>
      </section>
      ${security}
      <div class="tm-sd-footer"><p>Product management and shop settings are saved to your ThriftMall account.</p><button class="btn" id="out">Log out</button></div>
    </div>`;
    const sdAddJump = $('#sdAddJump');
    if (sdAddJump) sdAddJump.addEventListener('click', () => $('#sdAddForm')?.scrollIntoView({behavior:'smooth',block:'start'}));
    const applySellerFilters = () => {
      const q = ($('#sellerSearch')?.value || '').trim().toLowerCase();
      const cat = $('#sellerCategory')?.value || '';
      const sort = $('#sellerSort')?.value || 'newest';
      const list = $('#sellerListings');
      if (!list) return;
      const rows = [...list.querySelectorAll('[data-seller-row]')];
      rows.sort((a,b) => sort === 'name' ? a.dataset.name.localeCompare(b.dataset.name) : sort === 'price-low' ? Number(a.dataset.price)-Number(b.dataset.price) : sort === 'price-high' ? Number(b.dataset.price)-Number(a.dataset.price) : Number(b.dataset.created)-Number(a.dataset.created));
      rows.forEach(row => { list.appendChild(row); row.hidden = !(row.dataset.name.includes(q) && (!cat || row.dataset.category === cat)); });
      const visible = rows.filter(row => !row.hidden).length;
      const empty = $('#sellerNoResults'); if (empty) empty.hidden = visible > 0 || rows.length === 0;
    };
    $('#sellerSearch')?.addEventListener('input', applySellerFilters);
    $('#sellerCategory')?.addEventListener('change', applySellerFilters);
    $('#sellerSort')?.addEventListener('change', applySellerFilters);
    return;
  }
  if (u) {
    const fl = u.follows || [], sel = users.filter(x => x.type === 'seller');
    b.innerHTML = `<h2>Hi ${esc((u.name || 'there').split(' ')[0])}</h2>
      <p class="by">Manage your account and the finds you follow.</p>
      <section style="border-top:1px solid var(--rule);margin-top:16px;padding-top:16px">
        <h3 style="font-size:1.1rem;margin-bottom:10px">Your account</h3>
        <div class="f"><label for="profileName">Full name</label><input id="profileName" value="${esc(u.name || '')}" autocomplete="name"></div>
        <p class="by" style="margin-bottom:12px">Sign-in method: ${u.email ? 'Email · ' + esc(u.email) : 'Phone · ' + esc(u.phone || 'verified phone')}</p>
        <button class="btn full" id="saveProfile">Save account details</button>
      </section>
      <h3 style="font-size:1.1rem;margin:20px 0 8px">Follow categories</h3>
      <div class="seg" style="grid-template-columns:repeat(3,1fr)">${['Accessories','Clothing','Rare Finds'].map(c => `<button data-fol="cat:${c}" class="${fl.includes('cat:' + c) ? 'on' : ''}">${c}</button>`).join('')}</div>
      <h3 style="font-size:1.1rem;margin:16px 0 8px">Follow shops</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${sel.length ? sel.map(x => `<button class="mini${fl.includes('shop:' + x.id) ? ' in' : ''}" data-fol="shop:${x.id}">${fl.includes('shop:' + x.id) ? 'Following ' : 'Follow '}${esc(x.shop)}</button>`).join('') : '<span class="by">No shops yet.</span>'}</div>
      ${u.email ? `<label style="display:flex;gap:10px;margin:18px 0;align-items:flex-start"><input type="checkbox" id="opt"${u.opt ? ' checked' : ''} style="margin-top:6px"><span>Email me new arrivals and events at ${esc(u.email)}</span></label>` : '<p class="by" style="margin-top:18px">Email updates are available once a verified email address is linked to your account.</p>'}
      <section style="border-top:1px solid #e8caca;margin-top:22px;padding-top:16px">
        <h3 style="font-size:1.05rem;margin-bottom:8px">Delete account</h3>
        <p class="by">Permanently remove your account and associated data. This cannot be undone.</p>
        <button class="btn" id="deleteAccount" style="border:1px solid #b42318;color:#b42318;background:transparent">Delete my account</button>
      </section>
      ${security}
      <button class="btn full" style="margin-top:18px" id="out">Log out</button>`;
    return;
  }
  b.innerHTML = `<h2>${mode === 'login' ? 'Log in' : 'Create account'}</h2>
    ${mode === 'signup' ? `<div class="seg"><button data-t="buyer" class="${acct === 'buyer' ? 'on' : ''}">I'm a buyer</button><button data-t="seller" class="${acct === 'seller' ? 'on' : ''}">I'm a seller</button></div>` : ''}
    <div class="seg"><button data-method="email" class="${authMethod === 'email' ? 'on' : ''}">Email</button><button data-method="phone" class="${authMethod === 'phone' ? 'on' : ''}">Phone</button></div>
    ${authMethod === 'phone' && mode !== 'login' ? '<p class="by" style="margin:-6px 0 8px">Send verification code by</p><div class="seg"><button data-phone-channel="sms">SMS</button><button data-phone-channel="whatsapp">WhatsApp</button></div>' : ''}
    ${mode === 'signup' ? `<div class="f"><label for="fn">Full name</label><input id="fn" autocomplete="name"></div>` : ''}
    ${mode === 'signup' && acct === 'seller' ? `<div class="f"><label for="sh">Shop name</label><input id="sh" autocomplete="organization"></div><div class="two"><div class="f"><label for="lo">Location</label><input id="lo" placeholder="e.g. Harare, Avondale"></div><div class="f"><label for="wa">Public WhatsApp number</label><input id="wa" type="tel" placeholder="+263 77 123 4567"><small class="hint">Use a WhatsApp-registered number with country code. Zimbabwe: 077 123 4567 or +263 77 123 4567 (not +263 077...). Other countries: enter +country code and number.</small></div></div>` : ''}
    <div class="f"><label for="identifier">${authMethod === 'email' ? 'Email address' : 'Phone number with country code'}</label><input id="identifier" type="${authMethod === 'email' ? 'email' : 'tel'}" autocomplete="${authMethod === 'email' ? 'email' : 'tel'}" placeholder="${authMethod === 'email' ? 'you@example.com' : '+263 77 123 4567'}"></div>
    <div class="f"><label for="pw">Password</label><input id="pw" type="password" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" minlength="${mode === 'signup' ? 8 : 1}"></div>
    <button class="btn dark full" id="go">${mode === 'login' ? 'Log in' : 'Create account'}</button>
    ${mode === 'signup' ? '<p class="by" style="margin-top:10px">A verification code will be sent to your contact method. By creating an account you agree to our <button class="link" data-doc="terms">Terms</button> and <button class="link" data-doc="privacy">Privacy Policy</button>.</p>' : `<p style="text-align:center;margin-top:12px"><button class="link" data-action="forgot">Forgot password?</button></p>`}
    <p style="text-align:center;margin-top:14px">${mode === 'login' ? `No account? <button class="link" id="sw">Create a new account</button>` : `Have an account? <button class="link" id="sw">Log in</button>`}</p>
    ${mode === 'login' ? '<p class="by" style="text-align:center;margin-top:8px">Buying? You can browse without an account. Email confirmation is required when creating an account. Phone signup is temporarily unavailable while we keep registration free.</p>' : ''}`;
  syncPhoneChannelButtons(b);
}
function syncPhoneChannelButtons(root) {
  root.querySelectorAll('[data-phone-channel]').forEach(button => {
    const selected = button.dataset.phoneChannel === phoneOtpChannel;
    button.classList.toggle('on', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
function openAcc(m) { if (m) mode = m; else if (!me()) mode = 'login'; if (m === 'signup') acct = 'seller'; accView(); $('#accM').classList.add('show'); }
function safePhone(value) {
  const phone = String(value || '').trim().replace(/[\s().-]/g, '');
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : '';
}
function safeImageUrl(value) {
  try {
    if (!value) return '';
    const image = new URL(String(value), window.location.href);
    const project = new URL(SB_URL);
    if (image.protocol !== 'https:' || image.origin !== project.origin || !image.pathname.startsWith('/storage/v1/object/public/images/')) return '';
    return image.href;
  } catch { return ''; }
}
function safeImageCss(value) {
  const image = safeImageUrl(value);
  return image ? 'background-image:url("' + image + '")' : '';
}
function setPhoto(file,after){shrink(file).then(after).catch(()=>toast('Please choose an image file.'))}

const SB_URL='https://vkirepgarlrkfmnzvktj.supabase.co',SB_KEY='sb_publishable_yO_DVXdzCroTjrY5KD4ctQ_DTu4_dmy';
const emailConfirmationRedirect = /[?&]code=/.test(window.location.search) || /access_token=/.test(window.location.hash);
try {
  sb = window.supabase.createClient(SB_URL, SB_KEY);
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      mode = 'reset';
      setTimeout(() => { accView(); $('#accM').classList.add('show'); }, 0);
    }
    if (event === 'SIGNED_IN' && emailConfirmationRedirect && session?.user?.email_confirmed_at) {
      setTimeout(async () => {
        await loadAll();
        mode = 'login';
        accView();
        $('#accM').classList.add('show');
        toast('Email confirmed. Welcome to ThriftMall.');
      }, 0);
    }
  });
} catch (err) { console.error(err); }
const fromP = r => ({ id:r.id, type:r.type, name:r.name, shop:r.shop, loc:r.loc, wa:r.wa, logo:r.logo_url, follows:[], opt:false });
const fromPr = r => ({ id:r.id, sid:r.seller_id, name:r.name, price:r.price, size:r.size, cond:r.cond, cat:r.cat, img:r.img_url });
async function loadAll() {
  if (!sb) { toast('Could not connect. Check your internet and refresh.'); return; }
  const { data: sessionData } = await sb.auth.getSession();
  const session = sessionData && sessionData.session;
  meId = session ? session.user.id : null;
  const publicProfilesPromise = sb.from('profiles').select('id,type,name,shop,loc,wa,logo_url').eq('type','seller');
  const productsPromise = sb.from('products').select('*').order('created_at');
  const ownProfilePromise = meId
    ? sb.from('profiles').select('id,type,name,shop,loc,wa,logo_url').eq('id',meId).maybeSingle()
    : Promise.resolve({ data:null, error:null });
  const preferencesPromise = meId
    ? sb.from('profile_preferences').select('follows,updates_opt_in').eq('user_id',meId).maybeSingle()
    : Promise.resolve({ data:null, error:null });
  const [publicProfiles, productResult, ownProfile, preferences] = await Promise.all([
    publicProfilesPromise, productsPromise, ownProfilePromise, preferencesPromise
  ]);
  if (publicProfiles.error || productResult.error || ownProfile.error) {
    console.error(publicProfiles.error || productResult.error || ownProfile.error);
    toast('Could not load the shops. Please refresh.');
  }
  const profileMap = new Map((publicProfiles.data || []).map(row => [row.id, fromP(row)]));
  if (ownProfile.data) profileMap.set(ownProfile.data.id, fromP(ownProfile.data));
  users = [...profileMap.values()];
  prods = (productResult.data || []).map(fromPr);
  const own = users.find(row => row.id === meId);
  if (own && session) {
    own.email = session.user.email || null;
    own.phone = session.user.phone || null;
    own.follows = preferences.data?.follows || [];
    own.opt = !!preferences.data?.updates_opt_in;
  }
  if (preferences.error) console.warn('Could not load private preferences:', preferences.error.message);
  window.__ld = 1;
  render();
}
async function up(dataUrl,tag){
  const blob=await (await fetch(dataUrl)).blob();
  const path=meId+'/'+Date.now()+'-'+tag+'.jpg';
  const {error}=await sb.storage.from('images').upload(path,blob,{contentType:'image/jpeg'});
  if(error)throw error;
  return sb.storage.from('images').getPublicUrl(path).data.publicUrl;
}
async function handleAuth(t) {
  if (!sb) return toast('Not connected. Refresh and try again.');
  const input = $('#identifier')?.value.trim() || '';
  const password = $('#pw')?.value || '';
  let identifier = input;
  if (authMethod === 'email') {
    identifier = input.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) return toast('Enter a valid email address.');
  } else {
    identifier = safePhone(input);
    if (!identifier) return toast('Enter a phone number in international format, e.g. +263771234567.');
  }
  if (!password) return toast('Enter your password.');
  if (mode === 'signup' && password.length < 8) return toast('Use a password of at least 8 characters.');
  const button = t || $('#go'); if (button) button.disabled = true;
  try {
    if (mode === 'login') {
      const credentials = authMethod === 'email' ? { email: identifier, password } : { phone: identifier, password };
      const { error } = await sb.auth.signInWithPassword(credentials);
      if (error) throw new Error("Those details weren't accepted, or this contact method has not been verified. Check the details or recover your account.");
      await loadAll(); accView(); toast('Welcome back to ThriftMall.'); return;
    }
    const name = $('#fn')?.value.trim() || '';
    if (!name) throw new Error('Enter your full name.');
    const metadata = { type: acct, name };
    if (acct === 'seller') {
      const shop = $('#sh')?.value.trim() || '', location = $('#lo')?.value.trim() || '', whatsapp = $('#wa')?.value.trim() || '';
      if (!shop || !location || waNum(whatsapp).length < 9) throw new Error('Enter your shop name, location and a valid WhatsApp number.');
      Object.assign(metadata, { shop, loc: location, wa: whatsapp });
    }
    const options = { data: metadata, emailRedirectTo: 'https://metrovincenzo.github.io/thriftmall/' };
    const args = authMethod === 'email' ? { email: identifier, password, options } : { phone: identifier, password, options: { data: metadata, channel: phoneOtpChannel } };
    const { data, error } = await sb.auth.signUp(args);
    if (error) {
      const message = String(error.message || '').toLowerCase();
      if (message.includes('phone') && (message.includes('disabled') || message.includes('provider'))) throw new Error('Phone verification is not configured yet. Enable Phone Auth and configure an SMS provider in Supabase.');
      throw error;
    }
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      mode = 'login'; accView(); toast(authMethod === 'email' ? 'If this email can be registered, a confirmation link will arrive shortly. Check your inbox, then click the link to verify your account.' : 'If this phone can be registered, a verification code will arrive shortly. Otherwise, log in or recover your account.'); return;
    }
    if (data.session) {
      await sb.auth.signOut(); mode = 'login'; accView();
      toast('Supabase is allowing sign-up without a verification step. Enable email or phone confirmation in Supabase Auth before using registration.');
      return;
    }
    if (authMethod === 'email') {
      pendingAuth = null;
      mode = 'login';
      accView();
      toast('Account created. Check your email and click the confirmation link to verify your account. No code is needed.');
      return;
    }
    pendingAuth = { method: authMethod, identifier, intent: 'signup', channel: phoneOtpChannel };
    mode = 'verify'; accView(); toast('A verification code has been requested for your phone.');
  } catch (error) {
    toast(authErrorText(error));
  } finally { if (button) button.disabled = false; }
}
function authErrorText(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('already registered') || message.includes('already exists') || message.includes('user already')) return 'We could not create that account. If you already have an account, log in or use password recovery.';
  if (message.includes('phone') && (message.includes('disabled') || message.includes('provider'))) return 'Phone verification is not configured yet. Enable Phone Auth and configure an SMS provider in Supabase.';
  return error?.message || 'Something went wrong. Please try again.';
}
async function verifyOtp(t) {
  if (!pendingAuth) { mode = 'login'; accView(); return; }
  const token = String($('#otpCode')?.value || '').trim();
  if (!/^\d{6}$/.test(token)) return toast('Enter the 6-digit code.');
  t.disabled = true;
  try {
    const a = pendingAuth, type = a.method === 'email' ? (a.intent === 'signup' ? 'signup' : 'recovery') : 'sms';
    const payload = a.method === 'email' ? { email:a.identifier, token, type } : { phone:a.identifier, token, type:'sms' };
    const { error } = await sb.auth.verifyOtp(payload);
    if (error) throw new Error('That code was invalid or has expired. Request a new code and try again.');
    if (a.intent === 'email-reset' || a.intent === 'phone-reset') {
      pendingAuth = null; mode = 'reset'; accView(); toast('Contact verified. Choose a new password.'); return;
    }
    pendingAuth = null; mode = 'login'; await loadAll(); accView(); $('#accM').classList.add('show');
    toast('Your contact is verified. Welcome to ThriftMall.');
  } catch (error) { toast(authErrorText(error)); }
  finally { t.disabled = false; }
}
async function recovery(t) {
  if (!sb) return toast('Not connected. Refresh and try again.');
  let identifier = $('#identifier')?.value.trim() || '';
  if (authMethod === 'email') {
    identifier = identifier.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) return toast('Enter a valid email address.');
  } else {
    identifier = safePhone(identifier);
    if (!identifier) return toast('Enter a phone number in international format, e.g. +263771234567.');
  }
  t.disabled = true;
  try {
    if (authMethod === 'email') {
      const { error } = await sb.auth.resetPasswordForEmail(identifier, { redirectTo: window.location.origin + window.location.pathname });
      if (error) throw error;
      pendingAuth = { method:'email', identifier, intent:'email-reset' };
    } else {
      const { error } = await sb.auth.signInWithOtp({ phone:identifier, options:{ shouldCreateUser:false, channel:phoneOtpChannel } });
      if (error) throw error;
      pendingAuth = { method:'phone', identifier, intent:'phone-reset', channel:phoneOtpChannel };
    }
    mode = 'verify'; accView(); toast('If this contact is linked to an account, a recovery code will be sent.');
  } catch (error) { toast(authErrorText(error)); }
  finally { t.disabled = false; }
}
async function resendOtp(t) {
  if (!pendingAuth) return;
  const a = pendingAuth; t.disabled = true;
  try {
    let response;
    if (a.method === 'email' && a.intent === 'signup') response = await sb.auth.resend({ type:'signup', email:a.identifier });
    else if (a.method === 'phone' && a.intent === 'signup') response = await sb.auth.signInWithOtp({ phone:a.identifier, options:{ shouldCreateUser:false, channel:a.channel || 'sms' } });
    else if (a.method === 'email') response = await sb.auth.resetPasswordForEmail(a.identifier, { redirectTo:window.location.origin + window.location.pathname });
    else response = await sb.auth.signInWithOtp({ phone:a.identifier, options:{ shouldCreateUser:false } });
    if (response.error) throw response.error;
    toast('A new code has been requested, if the contact is eligible.');
  } catch (error) { toast(authErrorText(error)); }
  finally { t.disabled = false; }
}
async function deleteMyAccount(t) {
  const current = await sb.auth.getUser();
  const authUser = current.data?.user;
  if (current.error || !authUser) return toast('Please sign in again before deleting your account.');
  const confirmation = prompt('This permanently deletes your account, listings, shop profile, preferences and uploaded photos. Type DELETE to continue:');
  if (confirmation !== 'DELETE') return toast('Account deletion cancelled.');
  const password = prompt('For your security, enter your current password to confirm account deletion:');
  if (password === null || !password) return toast('Account deletion cancelled.');
  const credentials = authUser.email
    ? { email: authUser.email, password }
    : authUser.phone
      ? { phone: authUser.phone, password }
      : null;
  if (!credentials) return toast('Could not verify your sign-in method. Contact support before deleting your account.');
  t.disabled = true;
  try {
    const { data: reauthData, error: reauthError } = await sb.auth.signInWithPassword(credentials);
    if (reauthError || reauthData.user?.id !== authUser.id) {
      throw new Error('Password could not be verified. Your account has not been deleted.');
    }
    const { data: deleteData, error: deleteError } = await sb.functions.invoke('delete-account', { body: { confirm: 'DELETE' } });
    if (deleteError) {
      console.error(deleteError);
      throw new Error('Account deletion could not be completed. Your sign-in remains available; contact support if this repeats.');
    }
    await sb.auth.signOut();
    meId = null;
    pendingAuth = null;
    mode = 'login';
    $('#accM')?.classList.remove('show');
    await loadAll();
    render();
    toast(deleteData?.warning || 'Your ThriftMall account and associated data have been deleted.');
  } catch (error) {
    console.error(error);
    toast(error?.message || 'Could not delete your account. Please try again.');
  } finally {
    if (t) t.disabled = false;
  }
}
async function saveProfile(t) {
  const u = me(); if (!u) return toast('Please log in again.');
  const name = $('#profileName')?.value.trim() || '';
  if (!name) return toast('Enter your name.');
  const patch = { name };
  if (u.type === 'seller') {
    const shop = $('#profileShop')?.value.trim() || '', loc = $('#profileLocation')?.value.trim() || '', wa = $('#profileWhatsApp')?.value.trim() || '';
    if (!shop || !loc || waNum(wa).length < 9) return toast('Enter your shop name, location and a valid WhatsApp number.');
    Object.assign(patch, { shop, loc, wa });
  }
  t.disabled = true;
  try {
    const { error } = await sb.from('profiles').update(patch).eq('id', u.id);
    if (error) throw error;
    await loadAll(); accView(); toast(u.type === 'seller' ? 'Shop settings saved.' : 'Account details saved.');
  } catch (error) { toast('Could not save your details. Check your connection and try again.'); console.error(error); }
  finally { t.disabled = false; }
}
async function changePassword(t) {
  const next = $('#changeNewPassword')?.value || '', confirm = $('#changeConfirmPassword')?.value || '';
  if (next.length < 8) return toast('Use a password of at least 8 characters.');
  if (next !== confirm) return toast('The passwords do not match.');
  t.disabled = true;
  try {
    const { error } = await sb.auth.updateUser({ password:next });
    if (error) throw error;
    $('#changeNewPassword').value = ''; $('#changeConfirmPassword').value = '';
    toast('Password changed successfully.');
  } catch (error) { toast(error?.message || 'Could not change your password. Sign in again and retry.'); }
  finally { t.disabled = false; }
}
async function setPassword(t) {
  const next = $('#newPassword')?.value || '', confirm = $('#confirmPassword')?.value || '';
  if (next.length < 8) return toast('Use a password of at least 8 characters.');
  if (next !== confirm) return toast('The passwords do not match.');
  t.disabled = true;
  try {
    const { error } = await sb.auth.updateUser({ password:next });
    if (error) throw error;
    pendingAuth = null; mode = 'login'; await loadAll(); accView();
    toast('Your password has been updated.');
  } catch (error) { toast(error?.message || 'Could not reset the password. Request a new recovery code and try again.'); }
  finally { t.disabled = false; }
}

document.addEventListener('click',async e=>{
  const t=e.target;
  if(t.matches('.modal')||t.dataset.close!==undefined){document.querySelectorAll('.modal').forEach(m=>m.classList.remove('show'));return}
  if(t.id==='accBtn')return openAcc();
  if(t.id==='openShop')return me()?openAcc():openAcc('signup');
  if(t.id==='cartBtn')return openCart();
  const st=t.closest('[data-shop]');if(st){const id=st.dataset.shop;shopFilter=shopFilter===id?null:id;render();return}
  if(t.dataset.cart){const id=+t.dataset.cart;cart=cart.includes(id)?cart.filter(x=>x!==id):[...cart,id];store('tm_cart',cart);render();return}
  if(t.dataset.rm){cart=cart.filter(x=>x!==+t.dataset.rm);store('tm_cart',cart);render();openCart();return}
  if(t.dataset.pay)return pay(t.dataset.pay);
  if(t.dataset.t){acct=t.dataset.t;return accView()}
  if(t.id==='sw'){pendingAuth=null;mode=mode==='login'?'signup':'login';return accView()}
  if(t.id==='deleteAccount')return deleteMyAccount(t);
  if(t.id==='out'){await sb.auth.signOut();await loadAll();accView();return}
  if(t.id==='lgBtn')return $('#lgIn').click();
  if(t.id==='drop'||t.closest('#drop'))return $('#pin').click();
  if(t.dataset.fol){const m=me();if(!m)return;const k=t.dataset.fol,f=m.follows||[],nf=f.includes(k)?f.filter(x=>x!==k):[...f,k];const {error}=await sb.from('profile_preferences').upsert({user_id:m.id,follows:nf,updates_opt_in:!!m.opt},{onConflict:'user_id'});if(error)return toast('Could not save your preferences. Try again.');m.follows=nf;accView();render();return}
  if(t.dataset.editPhoto){
    const id=t.dataset.editPhoto, product=prods.find(p=>String(p.id)===String(id)), seller=me();
    if(!product||!seller||String(product.sid)!==String(seller.id))return toast('Could not find that product. Refresh and try again.');
    const picker=document.createElement('input');picker.type='file';picker.accept='image/jpeg,image/png,image/webp';
    picker.onchange=async()=>{
      const file=picker.files&&picker.files[0];if(!file)return;
      if(!['image/jpeg','image/png','image/webp'].includes(file.type))return toast('Choose a JPEG, PNG, or WebP image.');
      if(file.size>8*1024*1024)return toast('Choose an image smaller than 8 MB.');
      try{
        const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)});
        const img=await up(dataUrl,'p');
        const {error}=await sb.from('products').update({img_url:img}).eq('id',id).eq('seller_id',seller.id);
        if(error)throw error;
        await loadAll();accView();toast('Product photo updated.');
      }catch(err){console.error(err);toast('Could not update the photo. Please try again.')}
    };
    picker.click();return;
  }
  if(t.dataset.edit){
    const id=t.dataset.edit, product=prods.find(p=>String(p.id)===String(id)), seller=me();
    if(!product||!seller||String(product.sid)!==String(seller.id))return toast('Could not find that product. Refresh and try again.');
    const name=prompt('Product name:',product.name);if(name===null)return;
    const cleanName=name.trim();if(!cleanName)return toast('Product name cannot be empty.');
    const priceText=prompt('Price in US$:',String(product.price));if(priceText===null)return;
    const price=Number(priceText);if(priceText.trim()===''||!Number.isFinite(price)||price<0)return toast('Enter a valid price of US$0 or more.');
    const size=prompt('Size:',product.size);if(size===null)return;
    if(!size.trim())return toast('Size cannot be empty.');
    const condition=prompt('Condition (Like new, Good, Fair, well loved, or Needs repair):',product.cond);if(condition===null)return;
    const allowedConditions=['Like new','Good','Fair, well loved','Needs repair'];
    if(!allowedConditions.includes(condition.trim()))return toast('Choose one of the listed condition options.');
    const category=prompt('Category (Clothing, Accessories, or Rare Finds):',product.cat);if(category===null)return;
    const allowedCategories=['Clothing','Accessories','Rare Finds'];
    if(!allowedCategories.includes(category.trim()))return toast('Choose Clothing, Accessories, or Rare Finds.');
    const patch={name:cleanName,price,size:size.trim(),cond:condition.trim(),cat:category.trim()};
    const {error}=await sb.from('products').update(patch).eq('id',id).eq('seller_id',seller.id);
    if(error){console.error(error);return toast('Could not save your changes. Please try again.')}
    await loadAll();accView();toast('Product updated.');
    return;
  }
  if(t.dataset.del){const {error}=await sb.from('products').delete().eq('id',t.dataset.del);if(error)return toast('Could not delete. Try again.');await loadAll();return accView()}
  if(t.dataset.method){authMethod=t.dataset.method;return accView()}
  if(t.dataset.phoneChannel){
    phoneOtpChannel=t.dataset.phoneChannel;
    syncPhoneChannelButtons($('#accBody'));
    return;
  }
  if(t.dataset.action==='forgot'){mode='forgot';return accView()}
  if(t.id==='backLogin'){pendingAuth=null;mode='login';return accView()}
  if(t.id==='go')return handleAuth(t);
  if(t.id==='verifyOtp')return verifyOtp(t);
  if(t.id==='sendRecovery')return recovery(t);
  if(t.id==='resendOtp')return resendOtp(t);
  if(t.id==='setPassword')return setPassword(t);
  if(t.id==='changePassword')return changePassword(t);
  if(t.id==='saveProfile')return saveProfile(t);
  if(t.id==='addP'){
    const u=me(),n=$('#pn').value.trim(),p=parseFloat($('#pp').value),s=$('#ps').value.trim();
    if(!photo)return toast('Add a product photo first.');
    if(!n||!s||!(p>=0)||$('#pp').value==='')return toast('Enter the name, price in US$ and size.');
    t.disabled=true;
    try{
      const img=await up(photo,'p');
      const {error}=await sb.from('products').insert({seller_id:u.id,name:n,price:p,size:s,cond:$('#pc').value,cat:$('#pk').value,img_url:img});
      if(error)throw error;
      await loadAll();accView();toast('Added. It is now on the shop floor.');
    }catch(err){console.error(err);toast('Could not add the product. Try again.');t.disabled=false}
  }
});
document.addEventListener('change',async e=>{
  if(e.target.id==='opt'){
    const m=me(),on=e.target.checked;
    if(!m)return;
    const {error}=await sb.from('profile_preferences').upsert({user_id:m.id,follows:m.follows||[],updates_opt_in:on},{onConflict:'user_id'});
    if(error){toast('Could not save. Try again.');return}
    m.opt=on;toast(on?'Updates turned on.':'Updates turned off.');return;
  }
  const f=e.target.files&&e.target.files[0];if(!f)return;
  if(e.target.id==='lgIn')setPhoto(f,async d=>{
    try{
      const url=await up(d,'logo');
      const {error}=await sb.from('profiles').update({logo_url:url}).eq('id',meId);
      if(error)throw error;
      await loadAll();accView();toast('Shop image updated.');
    }catch(err){console.error(err);toast('Could not save the shop image.')}
  });
  if(e.target.id==='pin')setPhoto(f,showPhoto);
});
function showPhoto(d){photo=d;const pv=$('#pv');pv.src=d;pv.hidden=false}
document.addEventListener('dragover',e=>{if(e.target.closest('#drop')){e.preventDefault();$('#drop').classList.add('over')}});
document.addEventListener('dragleave',e=>{if(e.target.closest('#drop'))$('#drop').classList.remove('over')});
document.addEventListener('drop',e=>{if(e.target.closest('#drop')){e.preventDefault();$('#drop').classList.remove('over');setPhoto(e.dataTransfer.files[0],showPhoto)}});
['q','fc','fs'].forEach(id=>$('#'+id).addEventListener('input',render));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal').forEach(m=>m.classList.remove('show'))});
document.addEventListener('click',e=>{const b=e.target.closest('[data-doc]');if(b){$('#docBody').innerHTML=DOCS[b.dataset.doc];$('#docM').classList.add('show')}});
document.addEventListener('click',e=>{const c=e.target.closest('[data-cat]');if(!c)return;e.preventDefault();$('#fc').value=c.dataset.cat;shopFilter=null;render();$('#rail').scrollIntoView({behavior:'smooth'})});
document.addEventListener('click',e=>{if(e.target.closest('[data-open]')){e.preventDefault();$('#openShop').click()}});
(function(){const hs=$('#hs');if(!hs)return;const sl=[...hs.querySelectorAll('.slide')],dots=[...hs.querySelectorAll('.dots button')],pp=$('#hsPlay'),live=hs.querySelector('.slides'),D=6500,hov=matchMedia('(hover:hover)').matches;
let i=0,t=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,hold=false;
function tick(){clearTimeout(t);hs.style.setProperty('--d',D+'ms');hs.classList.remove('run');void hs.offsetWidth;if(playing&&!hold&&!document.hidden){hs.classList.add('run');t=setTimeout(()=>go(i+1),D)}}
function go(n){i=(n+sl.length)%sl.length;sl.forEach((s,k)=>{const on=k===i;s.classList.toggle('on',on);s.setAttribute('aria-hidden',on?'false':'true');s.querySelectorAll('a').forEach(a=>a.tabIndex=on?0:-1)});dots.forEach((d,k)=>{d.classList.toggle('on',k===i);d.setAttribute('aria-current',k===i?'true':'false')});tick()}
function setPlay(v){playing=v;pp.innerHTML=v?'&#10074;&#10074;':'&#9654;';pp.setAttribute('aria-label',v?'Pause slideshow':'Play slideshow');live.setAttribute('aria-live',v?'off':'polite');tick()}
$('#hsPrev').onclick=()=>go(i-1);$('#hsNext').onclick=()=>go(i+1);pp.onclick=()=>setPlay(!playing);dots.forEach((d,k)=>d.onclick=()=>go(k));
const hd=v=>{hold=v;hs.classList.toggle('hold',v);v?clearTimeout(t):tick()};
if(hov){hs.addEventListener('mouseenter',()=>hd(true));hs.addEventListener('mouseleave',()=>hd(false))}
hs.addEventListener('focusin',()=>hd(true));hs.addEventListener('focusout',()=>hd(false));
let x0=null;hs.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
hs.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)go(i+(dx<0?1:-1));x0=null});
hs.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(i+1);if(e.key==='ArrowLeft')go(i-1)});
document.addEventListener('visibilitychange',tick);
addEventListener('load',()=>hs.querySelectorAll('.bgimg[data-bg]').forEach(b=>{b.style.backgroundImage='url('+b.dataset.bg+')'}));
setPlay(playing);go(0)})();
render();loadAll();
