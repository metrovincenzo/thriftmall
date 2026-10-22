# ThriftMall compliance matrix

**Review date:** 2026-10-23. Preliminary issue-spotting only; not legal advice or a compliance certification. Applicability depends on business and processing facts that are not yet verified.

## Facts required from the owner

Business legal name/registered location; countries intentionally targeted; whether services are offered to EU/UK/Japan/California residents; user volume and annual revenue; sale/share/targeted advertising practices; provider legal entities/regions/contracts; whether minors can register; and the operator's role for each processing activity.

## Matrix

| Law / provision | Potential trigger and source | Evidence / gap | Status |
|---|---|---|---|
| Zimbabwe Cyber and Data Protection Act [Chapter 12:07], ss. 7, 9, 13–19, 23–24 | Potentially relevant to a Zimbabwe-focused marketplace. Official Act: https://www.ictministry.gov.zw/assets/documents/Cyber-and-Data-Protection-Act-Chapter-1207.pdf | Site describes a Zimbabwe marketplace and current privacy copy mentions the Act. Operator establishment, controller/processor registration, notice details, lawful purposes, breach process and transfer facts are unverified. Confirm with Zimbabwe counsel/POTRAZ. | **Requires owner/legal review** |
| EU GDPR, Arts. 3, 5–6, 12–14, 15–22, 28, 32–34, 44–49 | May apply through EU establishment or offering goods/services to or monitoring people in the EU. Official text: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679 | No evidence establishes EU targeting/establishment/monitoring. Supabase, Resend, Google Fonts and WhatsApp are referenced; their regions/terms are unverified. Determine territorial scope before concluding. | **Applicability unknown** |
| UK GDPR / Data Protection Act 2018 | Depends on UK territorial scope and processing; restricted transfers need a lawful mechanism. ICO guide: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-guide-to-international-transfers/ | UK establishment/targeting unknown. Confirm lawful bases, notices/rights, processor contracts and transfer safeguards if applicable. | **Applicability unknown** |
| Japan APPI | Depends on the operator and personal-data processing circumstances under APPI; owner's physical location alone does not decide applicability. Official PPC laws page: https://www.ppc.go.jp/en/legal/ | Japanese establishment/targeting and relevant data flows not established. Review disclosure, security, third-party provision and foreign-transfer requirements if applicable. | **Applicability unknown** |
| California CCPA/CPRA, including Civil Code §1798.140 | Applies to qualifying businesses doing business in California that meet statutory tests. CPPA threshold page: https://cppa.ca.gov/regulations/cpi_adjustment.html | California targeting, revenue, consumer volume, data sale/share and business structure unknown. CPPA page states the revenue threshold was adjusted to $26,625,000 effective 2025; verify current statutory applicability and other tests. | **Applicability unknown** |
| Email marketing rules | Depends on sender, recipient, message type and jurisdictions. | Preference table includes updates_opt_in, but the deployed digest function queries columns absent from profiles and likely fails. No successful end-to-end opt-out test performed. | **Partially addressed** |
| Consumer/e-commerce/marketplace rules | Depends on operator/seller role and target markets; may require seller disclosures, accurate prices, complaint process, returns/cancellation information. | Terms say sellers transact directly and site does not process payments. Seller verification, refund process and jurisdiction-specific notices not verified. | **Requires owner/legal review** |
| Cookies/tracking | Depends on actual trackers and jurisdiction. | No dedicated analytics script identified in inspected code; localStorage is used and Google Fonts is external. Full browser network/storage inspection not done. | **Not fully tested** |
| Accessibility / WCAG 2.2 AA target | Quality target; applicable legal duty depends on jurisdiction/business. | Some semantic elements and focus styles exist; no full audit. | **Not tested** |

## Sources checked 2026-10-23

- OWASP Top 10:2025: https://owasp.org/Top10/2025/
- OWASP ASVS 5.0.0: https://asvs.owasp.org/
- EU GDPR official text: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679
- ICO lawful basis guidance, updated 2 April 2026: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/
- ICO international transfer guide, updated 15 January 2026: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-guide-to-international-transfers/
- Japan PPC laws and policies: https://www.ppc.go.jp/en/legal/
- Zimbabwe Cyber and Data Protection Act: https://www.ictministry.gov.zw/assets/documents/Cyber-and-Data-Protection-Act-Chapter-1207.pdf
- California CPPA adjusted thresholds: https://cppa.ca.gov/regulations/cpi_adjustment.html
- Supabase password security: https://supabase.com/docs/guides/auth/password-security
- Supabase CAPTCHA: https://supabase.com/docs/guides/auth/auth-captcha

Laws and guidance change. Confirm current law and seek qualified legal advice before relying on this matrix.
