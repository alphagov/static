// = require_self

(function ($) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  var takeSurveyLink = function (text, className) {
    className = className ? 'class="' + className + '"' : ''
    return '<a ' + className + ' href="{{surveyUrl}}" id="take-survey" target="_blank" rel="noopener noreferrer">' + text + '</a>'
  }

  var templateBase = function (children) {
    return (
      '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">' +
      '  <div class="survey-wrapper">' +
      '    <a class="survey-close-button" href="#user-survey-cancel" aria-labelledby="survey-title user-survey-cancel" id="user-survey-cancel" role="button">Close</a>' +
      '    <h2 class="survey-title" id="survey-title">{{title}}</h2>' +
           children +
      '  </div>' +
      '</section>'
    )
  }

  var URL_SURVEY_TEMPLATE = templateBase(
    '<p>' +
      takeSurveyLink('{{surveyCta}}', 'survey-primary-link') +
    ' <span class="postscript-cta">{{surveyCtaPostscript}}</span>' +
    '</p>'
  )

  var EMAIL_SURVEY_TEMPLATE = templateBase(
    '<div id="email-survey-pre">' +
    '  <a class="survey-primary-link" href="#email-survey-form" id="email-survey-open" rel="noopener noreferrer" role="button" aria-expanded="false">' +
    '    {{surveyCta}}' +
    '  </a>' +
    '</div>' +
    '<form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="js-hidden" aria-hidden="true">' +
    '  <div class="survey-inner-wrapper">' +
    '    <div id="survey-form-description" class="survey-form-description">{{surveyFormDescription}}' +
    '      <br> {{surveyFormCtaPostscript}}' +
    '    </div>' +
    '    <label class="survey-form-label" for="survey-email-address">' +
    '      Email Address' +
    '    </label>' +
    '    <input name="email_survey_signup[survey_id]" type="hidden" value="{{surveyId}}">' +
    '    <input name="email_survey_signup[survey_source]" type="hidden" value="{{surveySource}}">' +
    '    <input name="email_survey_signup[ga_client_id]" type="hidden" value="{{gaClientId}}">' +
    '    <input class="survey-form-input" name="email_survey_signup[email_address]" id="survey-email-address" type="text" aria-describedby="survey-form-description">' +
    '    <button class="survey-form-button" type="submit">{{surveyFormCta}}</button>' +
         takeSurveyLink('{{surveyFormNoEmailInvite}}') +
    '  </div>' +
    '</form>' +
    '<div id="email-survey-post-success" class="js-hidden" aria-hidden="true" tabindex="-1">' +
    '  {{surveySuccess}}' +
    '</div>' +
    '<div id="email-survey-post-failure" class="js-hidden" aria-hidden="true" tabindex="-1">' +
    '  {{surveyFailure}}' +
    '</div>'
  )
  var SURVEY_SEEN_TOO_MANY_TIMES_LIMIT = 2
  var MAX_MOBILE_WIDTH = "(max-width: 800px)"

  /* This data structure is explained in `doc/surveys.md` */
  var userSurveys = {
    defaultSurvey: {
      url: 'https://www.smartsurvey.co.uk/s/gov_uk?c={{currentPath}}',
      identifier: 'user_satisfaction_survey',
      frequency: 6,
      surveyType: 'email'
    },
    smallSurveys: [
      {
        identifier: '#Userpanel',
        surveyType: 'url',
        frequency: 5,
        startTime: new Date("February 01, 2019").getTime(),
        endTime: new Date("December 31, 2019").getTime(),
        url: 'https://response.questback.com/intellectualpropertyoffice/ipocustomerpanel?c={{currentPath}}',
        templateArgs: {
          title: "Help improve our online services",
          surveyCta: 'Join the IPO user panel',
          surveyCtaPostscript: '(opens in new window)'
        },
        activeWhen: {
          path: [
            '^/topic/intellectual-property/trade-marks',
            '^/topic/intellectual-property/patents',
            '^/topic/intellectual-property/designs',
            '^/government/organisations/intellectual-property-office',
            '^/how-to-register-a-trade-mark',
            '^/apply-for-a-patent',
            '^/apply-register-design'
          ]
        }
      },
      {
        identifier: 'service_standards_reports_survey',
        surveyType: 'url',
        frequency: 1,
        startTime: new Date("February 26, 2019").getTime(),
        endTime: new Date("March 27, 2019").getTime(),
        url: 'https://www.smartsurvey.co.uk/s/SurveyStandardReportsPage/',
        templateArgs: {
          title: "Help us improve Service Standards Reports on GOV.UK",
          surveyCta: 'Take the 3 minute survey',
          surveyCtaPostscript: '(This will open a short survey on another website)'
        },
        activeWhen: {
          path: [
            '^/service-standard-reports'
          ]
        }
      },
      {
        identifier: 'cookies-survey',
        surveyType: 'url',
        frequency: 2,
        startTime: new Date("March 13, 2019").getTime(),
        endTime: new Date("April 30, 2019").getTime(),
        url: 'https://www.smartsurvey.co.uk/s/ZUHHE/?c={{currentPath}}',
        templateArgs: {
          title: "Help improve GOV.UK",
          surveyCta: 'Take a short survey to make the website better',
          surveyCtaPostscript: '(This will open a short survey on another website)'
        },
        activeWhen: {
          path: [
            '^/after-a-death/organisations-you-need-to-contact-and-tell-us-once',
            '^/apply-citizenship-eea',
            '^/apply-council-tax-reduction',
            '^/apply-first-adult-passport',
            '^/apply-first-adult-passport/apply-online',
            '^/apply-first-adult-passport/what-documents-you-need-to-apply',
            '^/apply-for-a-uk-residence-card/permanent-residence-card',
            '^/apply-for-council-housing',
            '^/apply-for-student-finance',
            '^/apply-for-student-finance/when',
            '^/asd-and-driving',
            '^/attendance-allowance/how-to-claim',
            '^/benefit-cap-calculator',
            '^/browse/abroad/travel-abroad',
            '^/browse/births-deaths-marriages/death',
            '^/browse/births-deaths-marriages/marriage-divorce',
            '^/browse/citizenship',
            '^/browse/citizenship/citizenship',
            '^/browse/driving/disability-health-condition',
            '^/browse/visas-immigration/family-visas',
            '^/browse/visas-immigration/settle-in-the-uk',
            '^/capital-gains-tax',
            '^/carers-allowance/eligibility',
            '^/change-name-deed-poll',
            '^/child-benefit/eligibility',
            '^/choose-uk-visit-short-stay-visa',
            '^/council-tax/paying-your-bill',
            '^/driving-licence-fees',
            '^/electoral-register/view-electoral-register',
            '^/employee-tax-codes',
            '^/eori',
            '^/european-health-insurance-card',
            '^/family-permit',
            '^/fishing-licences/buy-a-fishing-licence',
            '^/foreign-travel-advice/india',
            '^/foreign-travel-advice/turkey/entry-requirements',
            '^/get-help-savings-low-income',
            '^/get-state-pension',
            '^/government/collections/national-curriculum',
            '^/government/collections/national-curriculum-assessments-practice-materials',
            '^/government/history/past-foreign-secretaries',
            '^/government/history/past-prime-ministers',
            '^/government/latest',
            '^/government/news/defence-secretary-announces-five-year-plan-for-key-military-sites',
            '^/government/news/proposed-new-timetable-for-state-pension-age-increases',
            '^/government/news/uk-statement-on-re-election-of-president-buhari-in-nigeria',
            '^/government/organisations/hm-revenue-customs/contact/child-benefit',
            '^/government/organisations/hm-revenue-customs/contact/vat-online-services-helpdesk',
            '^/government/organisations/home-office',
            '^/government/organisations/medicines-and-healthcare-products-regulatory-agency',
            '^/government/organisations/public-health-england',
            '^/government/publications/advisory-fuel-rates',
            '^/government/publications/advisory-fuel-rates/advisory-fuel-rates-from-1-march-2016',
            '^/government/publications/general-information-about-checks-by-compliance-centres-ccfs1b',
            '^/government/publications/guidance-on-applying-for-uk-visa-approved-english-language-tests',
            '^/government/publications/introducing-govuk-verify/introducing-govuk-verify',
            '^/government/publications/key-stage-2-tests-2018-mathematics-test-materials',
            '^/government/publications/statutory-sick-pay-employees-statement-of-sickness-sc2',
            '^/guidance/rates-and-thresholds-for-employers-2019-to-2020',
            '^/guidance/the-highway-code',
            '^/hand-luggage-restrictions',
            '^/holiday-entitlement-rights',
            '^/housing-and-universal-credit',
            '^/inheritance-tax',
            '^/inheritance-tax/gifts',
            '^/limited-company-formation/register-your-company',
            '^/make-court-claim-for-money/court-fees',
            '^/marriage-allowance/how-to-apply',
            '^/married-couples-allowance',
            '^/maternity-pay-leave/leave',
            '^/national-insurance/how-much-you-pay',
            '^/news-and-communications',
            '^/pay-dartford-crossing-charge/charges-fines',
            '^/pay-self-assessment-tax-bill/bank-details',
            '^/pay-vat',
            '^/power-of-attorney',
            '^/register-employer',
            '^/register-offices',
            '^/research-family-history',
            '^/schools-admissions/admissions-criteria',
            '^/scrapped-and-written-off-vehicles',
            '^/search/advanced',
            '^/self-assessment-forms-and-helpsheets',
            '^/self-assessment-tax-returns/sending-return',
            '^/settled-status-eu-citizens-families/after-youve-applied',
            '^/stamp-duty-land-tax',
            '^/stamp-duty-land-tax/residential-property-rates',
            '^/statutory-sick-pay/what-youll-get',
            '^/tax-on-dividends',
            '^/tell-hmrc-change-address',
            '^/theory-test',
            '^/theory-test/revision-and-practice',
            '^/topic/company-registration-filing/starting-company',
            '^/track-passport-application',
            '^/track-your-driving-licence-application',
            '^/universal-credit/get-an-advance-first-payment',
            '^/vat-registration',
            '^/vehicle-exempt-from-vehicle-tax',
            '^/vehicle-registration',
            '^/vehicle-registration/new-and-used-vehicles',
            '^/additional-state-pension',
            '^/advanced-learner-loan',
            '^/apply-for-divorce',
            '^/apply-for-primary-school-place',
            '^/apply-free-school-meals',
            '^/apply-start-up-loan',
            '^/apply-tax-free-interest-on-savings',
            '^/attendance-allowance/eligibility',
            '^/basic-paye-tools',
            '^/become-a-driving-instructor',
            '^/benefit-cap',
            '^/bereavement-allowance',
            '^/bereavement-payment',
            '^/bereavement-support-payment',
            '^/biometric-residence-permits/collect',
            '^/biometric-residence-permits/lost-stolen-damaged',
            '^/browse/benefits/heating',
            '^/browse/business/business-tax',
            '^/browse/business/setting-up',
            '^/browse/driving/penalty-points-fines-bans',
            '^/browse/driving/vehicle-and-driver-information',
            '^/browse/education/find-course',
            '^/browse/employing-people/contracts',
            '^/browse/justice',
            '^/browse/tax/dealing-with-hmrc',
            '^/browse/tax/national-insurance',
            '^/browse/working/time-off',
            '^/budgeting-help-benefits/repayments',
            '^/buying-carrying-knives',
            '^/calculate-your-business-rates',
            '^/capital-gains-tax/what-you-pay-it-on',
            '^/carers-allowance-unit',
            '^/carers-credit',
            '^/change-name-deed-poll/enrol-a-deed-poll-with-the-courts',
            '^/change-name-deed-poll/make-an-adult-deed-poll',
            '^/changing-passport-information/name-marriage-and-civil-partnership',
            '^/child-benefit-rates',
            '^/child-benefit-tax-charge',
            '^/child-car-seats-the-rules/when-a-child-can-travel-without-a-car-seat',
            '^/child-maintenance/how-to-apply',
            '^/child-tax-credit/how-to-claim',
            '^/claim-rural-payments/sign-in/prove-identity',
            '^/claim-tax-credits/what-counts-as-income',
            '^/cma-cases',
            '^/co2-and-vehicle-tax-tools',
            '^/cold-weather-payment',
            '^/contact/govuk',
            '^/contracts-finder',
            '^/copy-decree-absolute-final-order',
            '^/corporation-tax',
            '^/council-tax-appeals',
            '^/council-tax/discounts-for-disabled-people',
            '^/council-tax/discounts-for-full-time-students',
            '^/council-tax/second-homes-and-empty-properties',
            '^/countryside-stewardship-grants',
            '^/crime-justice-and-law/criminal-justice-reform',
            '^/criminal-record-checks-apply-role',
            '^/dbs-check-applicant-criminal-record/get-a-basic-dbs-check-for-an-employee',
            '^/dbs-check-applicant-criminal-record/get-a-standard-or-enhanced-dbs-check-for-an-employee',
            '^/deferring-state-pension',
            '^/disability-living-allowance-children/rates',
            '^/disabled-students-allowances-dsas',
            '^/divorce/apply-for-decree-nisi',
            '^/done/motor-trade-bought',
            '^/done/motor-trade-sold',
            '^/drink-drive-limit',
            '^/driving-disqualifications',
            '^/driving-eyesight-rules',
            '^/driving-lessons-learning-to-drive',
            '^/driving-test/using-your-own-car',
            '^/driving-test/what-happens-during-test',
            '^/duty-free-goods/arrivals-from-eu-countries',
            '^/duty-free-goods/arrivals-from-outside-the-eu',
            '^/early-years-foundation-stage',
            '^/email-signup/',
            '^/email/subscriptions/complete',
            '^/emergency-travel-document',
            '^/employee-tax-codes/letters',
            '^/employee-tax-codes/numbers',
            '^/employment-status',
            '^/employment-status/selfemployed-contractor',
            '^/employment-support-allowance/change-of-circumstances',
            '^/employment-tribunals',
            '^/english-language/approved-english-language-qualifications',
            '^/evicting-tenants/section-21-and-section-8-notices',
            '^/exchange-paper-driving-licence',
            '^/expenses-and-benefits-a-to-z',
            '^/expenses-and-benefits-business-travel-mileage/rules-for-tax',
            '^/export-health-certificates',
            '^/family-permit/eligibility',
            '^/file-your-company-accounts-and-tax-return',
            '^/financial-help-disabled',
            '^/find-charity-information',
            '^/find-free-early-education',
            '^/find-ofsted-inspection-report',
            '^/flexible-working',
            '^/foreign-travel-advice/australia/entry-requirements',
            '^/foreign-travel-advice/canada/entry-requirements',
            '^/foreign-travel-advice/india/entry-requirements',
            '^/foreign-travel-advice/spain',
            '^/foreign-travel-advice/spain/entry-requirements',
            '^/funding-for-postgraduate-study',
            '^/funeral-payments',
            '^/future-pension-centre',
            '^/get-blue-badge',
            '^/get-information-about-property-and-land',
            '^/get-personalised-private-number-plate',
            '^/get-undergraduate-student-loan',
            '^/getting-an-mot',
            '^/goods-sent-from-abroad',
            '^/goods-sent-from-abroad/tax-and-duty',
            '^/government/collections/citizenship-application-forms',
            '^/government/collections/companies-house-forms-for-limited-companies',
            '^/government/collections/dbs-update-service-promotional-material',
            '^/government/collections/how-to-prepare-if-the-uk-leaves-the-eu-with-no-deal',
            '^/government/collections/immunisation-against-infectious-disease-the-green-book',
            '^/government/collections/making-tax-digital-for-vat',
            '^/government/collections/planning-practice-guidance',
            '^/government/consultations/education-inspection-framework-2019-inspecting-the-substance-of-education',
            '^/government/news/free-helplines-for-universal-credit-claimants',
            '^/government/news/opt-out-organ-donation-max-and-keira-s-bill-passed-into-law',
            '^/government/news/radical-shake-up-of-advice-to-pension-schemes-will-benefit-savers-and-boost-1-6-trillion-pension-assets',
            '^/government/organisations/companies-house/about-our-services',
            '^/government/organisations/competition-and-markets-authority',
            '^/government/organisations/insolvency-service',
            '^/government/organisations/legal-aid-agency',
            '^/government/organisations/ministry-of-housing-communities-and-local-government',
            '^/government/organisations/ministry-of-justice',
            '^/government/organisations/prime-ministers-office-10-downing-street',
            '^/government/organisations/rural-payments-agency',
            '^/government/publications/2018-key-stage-2-scaled-score-conversion-tables',
            '^/government/publications/application-to-naturalise-as-a-british-citizen-form-an/apply-online-form-an',
            '^/government/publications/application-to-register-child-under-18-as-british-citizen-form-mn1',
            '^/government/publications/application-to-settle-in-the-uk-form-setm',
            '^/government/publications/application-to-transfer-or-retain-a-vehicle-registration-number',
            '^/government/publications/apply-for-a-registration-certificate-or-residence-card-for-a-family-member-form-eea-fm',
            '^/government/publications/apply-for-a-uk-visa-in-china/--2',
            '^/government/publications/apply-for-help-with-court-and-tribunal-fees',
            '^/government/publications/apprenticeship-levy-how-it-will-work/apprenticeship-levy-how-it-will-work',
            '^/government/publications/change-the-register-ap1',
            '^/government/publications/civil-service-competency-framework',
            '^/government/publications/education-inspection-framework-draft-for-consultation',
            '^/government/publications/eu-exit-parameters-of-extending-article-50',
            '^/government/publications/financial-sanctions-consolidated-list-of-targets/consolidated-list-of-targets',
            '^/government/publications/fire-safety-approved-document-b',
            '^/government/publications/income-tax-claiming-tax-back-when-you-have-stopped-working-p50',
            '^/government/publications/income-tax-leaving-the-uk-getting-your-tax-right-p85',
            '^/government/publications/inheritance-tax-inheritance-tax-account-iht400',
            '^/government/publications/inheritance-tax-return-of-estate-information-iht205-2011',
            '^/government/publications/keeping-children-safe-in-education--2',
            '^/government/publications/key-stage-1-tests-2018-english-reading-test-materials',
            '^/government/publications/key-stage-2-tests-2018-english-reading-test-materials',
            '^/government/publications/mot-inspection-checklist-vt-29',
            '^/government/publications/mot-inspection-manual-for-class-3-4-5-and-7-vehicles',
            '^/government/publications/mot-testing-guide',
            '^/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study',
            '^/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study',
            '^/government/publications/national-curriculum-in-england-primary-curriculum',
            '^/government/publications/national-framework-for-nhs-continuing-healthcare-and-nhs-funded-nursing-care',
            '^/government/speeches/spring-statement-2019-philip-hammonds-speech',
            '^/government/uploads/system/uploads/attachment_data/file/782717/exrates-monthly-0319.csv/preview',
            '^/guidance/bps-2019',
            '^/guidance/finding-commodity-codes-for-imports-or-exports',
            '^/guidance/foreign-travel-insurance',
            '^/guidance/get-a-uk-eori-number-to-trade-within-the-eu',
            '^/guidance/immigration-rules/immigration-rules-appendix-v-visitor-rules',
            '^/guidance/job-expenses-for-uniforms-work-clothing-and-tools',
            '^/guidance/living-in-germany',
            '^/guidance/making-tax-digital-for-vat-as-an-agent-step-by-step',
            '^/guidance/security-vetting-and-clearance',
            '^/guidance/sign-in-to-your-agent-services-account',
            '^/guidance/start-paying-council-tax',
            '^/guidance/the-highway-code/traffic-signs',
            '^/hand-luggage-restrictions/personal-items',
            '^/health-conditions-disability-universal-credit',
            '^/healthcare-immigration-application',
            '^/healthcare-immigration-application/pay',
            '^/help',
            '^/help-with-childcare-costs/childcare-vouchers',
            '^/housing-association-homes',
            '^/how-to-claim-new-style-esa',
            '^/how-to-claim-new-style-jsa',
            '^/how-to-have-your-benefits-paid',
            '^/how-to-register-a-trade-mark/apply',
            '^/income-support/what-youll-get',
            '^/income-tax-reliefs',
            '^/income-tax/how-you-pay-income-tax',
            '^/inheritance-tax/passing-on-home',
            '^/international-pension-centre',
            '^/jury-service',
            '^/law-on-leaving-your-child-home-alone',
            '^/learn-to-drive-a-car',
            '^/legal-obligations-drivers-riders',
            '^/lifetime-isa',
            '^/make-a-freedom-of-information-request',
            '^/make-will',
            '^/marriages-civil-partnerships/what-you-need-to-do',
            '^/masters-loan',
            '^/masters-loan/eligibility',
            '^/masters-loan/what-youll-get',
            '^/maternity-allowance/eligibility',
            '^/maternity-allowance/how-to-claim',
            '^/money-property-when-relationship-ends',
            '^/motorcycle-cbt',
            '^/national-insurance-credits/eligibility',
            '^/national-insurance-rates-letters/category-letters',
            '^/new-employee-tax-code',
            '^/new-state-pension/how-to-claim',
            '^/passport-interview-office',
            '^/paternity-pay-leave',
            '^/pay-class-2-national-insurance',
            '^/pay-dvla-fine',
            '^/pay-tax-debit-credit-card',
            '^/pay-vat',
            '^/pay-voluntary-class-3-national-insurance',
            '^/paye-forms-p45-p60-p11d/p60',
            '^/penalties-drug-possession-dealing',
            '^/pension-credit/eligibility',
            '^/pension-credit/what-youll-get',
            '^/personalised-vehicle-registration-numbers/renew-private-number-certificate',
            '^/pip/when-your-pip-claim-is-reviewed',
            '^/planning-permission-england-wales',
            '^/power-of-attorney/register',
            '^/prepare-file-annual-accounts-for-limited-company',
            '^/private-renting',
            '^/prove-right-to-work',
            '^/register-a-birth',
            '^/register-birth',
            '^/renting-out-a-property/paying-tax',
            '^/repaying-your-student-loan/what-you-pay',
            '^/report-suspicious-emails-websites-phishing',
            '^/report-untaxed-vehicle',
            '^/request-information-from-dvla',
            '^/responsibilities-selling-vehicle',
            '^/rest-breaks-work/taking-breaks',
            '^/ride-motorcycle-moped/bike-categories-ages-and-licence-requirements',
            '^/right-of-abode',
            '^/right-to-buy-buying-your-council-home/discounts',
            '^/sa302-tax-calculation',
            '^/school-attendance-absence',
            '^/scottish-income-tax',
            '^/search-for-patent',
            '^/self-employed-national-insurance-rates',
            '^/send-fit-note',
            '^/settled-status-eu-citizens-families/not-eu-eea-swiss-citizen',
            '^/shotgun-and-firearm-certificates',
            '^/sign-in-help-to-save',
            '^/speed-limits',
            '^/state-pension-if-you-retire-abroad',
            '^/state-pension/what-youll-get',
            '^/statutory-sick-pay/how-to-claim',
            '^/strike-off-your-company-from-companies-register/close-down-your-company',
            '^/student-finance/eu-students',
            '^/support-child-or-partners-student-finance-application',
            '^/sure-start-maternity-grant/how-to-claim',
            '^/sure-start-maternity-grant/what-youll-get',
            '^/take-pet-abroad/pet-passport',
            '^/tax-company-benefits/tax-on-company-cars',
            '^/tax-help',
            '^/tax-on-your-private-pension/pension-tax-relief',
            '^/tax-right-retire-abroad-return-to-uk',
            '^/tax-sell-property',
            '^/tb-test-visa/countries-where-you-need-a-tb-test-to-enter-the-uk',
            '^/tenancy-deposit-protection',
            '^/theory-test/hazard-perception-test',
            '^/tier-1-entrepreneur',
            '^/tier-2-general/documents-you-must-provide',
            '^/tier-5-youth-mobility/eligibility',
            '^/time-off-for-dependants',
            '^/topic/benefits-credits/tax-credits',
            '^/topic/business-tax/import-export',
            '^/topic/company-registration-filing/forms',
            '^/topic/dealing-with-hmrc/tax-agent-guidance',
            '^/topic/immigration-operational-guidance',
            '^/topic/land-registration/searches-fees-forms',
            '^/topic/personal-tax/national-insurance',
            '^/towing-rules',
            '^/tv-licence',
            '^/types-of-british-nationality',
            '^/uk-benefits-abroad',
            '^/uk-family-visa/knowledge-of-english',
            '^/uk-family-visa/parent',
            '^/universal-credit/changes-of-circumstances',
            '^/universal-credit/your-responsibilities',
            '^/valuing-estate-of-someone-who-died/tell-hmrc-estate-value',
            '^/vat-rates',
            '^/vat-registration/cancel-registration',
            '^/vat-registration/when-to-register',
            '^/vat-returns/fill-in-your-return',
            '^/vehicle-registration/new-registrations',
            '^/view-right-to-work',
            '^/voluntary-national-insurance-contributions/deadlines',
            '^/what-you-must-do-as-a-cis-subcontractor/how-to-register',
            '^/wills-probate-inheritance/if-the-person-didnt-leave-a-will',
            '^/wills-probate-inheritance/if-the-person-left-a-will',
            '^/working-tax-credit/how-to-claim',
            '^/workplace-pensions/what-you-your-employer-and-the-government-pay',
            '^/world',
            '^/world/brexit-ireland',
            '^/write-business-plan'
          ]
        }
      }
    ],

    init: function () {
      if (userSurveys.canShowAnySurvey()) {
        var activeSurvey = userSurveys.getActiveSurvey(userSurveys.defaultSurvey, userSurveys.smallSurveys)
        if (activeSurvey !== undefined) {
          $('#global-bar').hide(); // Hide global bar if one is showing
          userSurveys.displaySurvey(activeSurvey)
        }
      }
    },

    canShowAnySurvey: function () {
      if (userSurveys.pathInBlacklist()) {
        return false
      } else if (userSurveys.otherNotificationVisible()) {
        return false
      } else if (userSurveys.userCompletedTransaction()) {
        // We don't want any survey appearing for users who have completed a
        // transaction as they may complete the survey with the department's
        // transaction in mind as opposed to the GOV.UK content.
        return false
      } else if ($('#user-satisfaction-survey-container').length <= 0) {
        return false
      } else {
        return true
      }
    },

    processTemplate: function (args, template) {
      $.each(args, function (key, value) {
        template = template.replace(
          new RegExp('\{\{' + key + '\}\}', 'g'),
          value
        )
      })
      return template
    },

    getUrlSurveyTemplate: function () {
      return {
        render: function(survey) {
          var defaultUrlArgs = {
            title: 'Tell us what you think of GOV.UK',
            surveyCta: 'Take the 3 minute survey',
            surveyCtaPostscript: 'This will open a short survey on another website',
            surveyUrl: userSurveys.addParamsToURL(userSurveys.getSurveyUrl(survey)),
          }
          var mergedArgs = $.extend(defaultUrlArgs, survey.templateArgs)
          return userSurveys.processTemplate(mergedArgs, URL_SURVEY_TEMPLATE)
        }
      }
    },

    getEmailSurveyTemplate: function () {
      return {
        render: function(survey) {
          var defaultEmailArgs = {
            title: 'Tell us what you think of GOV.UK',
            surveyCta: 'Take a short survey to give us your feedback',
            surveyFormDescription: 'We’ll send you a link to a feedback form. It only takes 2 minutes to fill in.',
            surveyFormCta: 'Send me the survey',
            surveyFormCtaPostscript: 'Don’t worry: we won’t send you spam or share your email address with anyone.',
            surveyFormNoEmailInvite: 'Don’t have an email address?',
            surveySuccess: 'Thanks, we’ve sent you an email with a link to the survey.',
            surveyFailure: 'Sorry, we’re unable to send you an email right now. Please try again later.',
            surveyId: survey.identifier,
            surveySource: userSurveys.currentPath(),
            surveyUrl: userSurveys.addParamsToURL(userSurveys.getSurveyUrl(survey)),
            gaClientId: GOVUK.analytics.gaClientId,
          }
          var mergedArgs = $.extend(defaultEmailArgs, survey.templateArgs)
          return userSurveys.processTemplate(mergedArgs, EMAIL_SURVEY_TEMPLATE)
        }
      }
    },

    getActiveSurveys: function (surveys) {
      return $.grep(surveys, function (survey, _index) {
        if (userSurveys.currentTime() >= survey.startTime && userSurveys.currentTime() <= survey.endTime) {
          return userSurveys.activeWhen(survey)
        }
      })
    },

    getDisplayableSurveys: function (surveys) {
      return $.grep(surveys, function (survey, _index) {
        return userSurveys.isSurveyToBeDisplayed(survey)
      })
    },

    getActiveSurvey: function (defaultSurvey, smallSurveys) {
      var activeSurveys = userSurveys.getActiveSurveys(smallSurveys)
      var allSurveys = [defaultSurvey].concat(activeSurveys)
      var displayableSurveys = userSurveys.getDisplayableSurveys(allSurveys)

      if (displayableSurveys.length < 2) {
        return displayableSurveys[0]
      } else {
        // At this point, if there are multiple surveys that could be shown
        // it is fair to roll the dice and pick one; we've already considered
        // frequency in isSurveyToBeDisplayed so we don't need to worry about
        // it here
        return displayableSurveys[Math.floor(Math.random() * displayableSurveys.length)]
      }
    },

    displaySurvey: function (survey) {
      var surveyContainer = $('#user-satisfaction-survey-container')
      if (survey.surveyType === 'email') {
        userSurveys.displayEmailSurvey(survey, surveyContainer)
      } else if ((survey.surveyType === 'url') || (survey.surveyType === undefined)) {
        userSurveys.displayURLSurvey(survey, surveyContainer)
      } else {
        return
      }
      userSurveys.incrementSurveySeenCounter(survey)
      userSurveys.trackEvent(survey.identifier, 'banner_shown', 'Banner has been shown')
    },

    displayURLSurvey: function (survey, surveyContainer) {
      var urlSurveyTemplate = userSurveys.getUrlSurveyTemplate()
      surveyContainer.append(urlSurveyTemplate.render(survey))
      userSurveys.setURLSurveyEventHandlers(survey)
    },

    displayEmailSurvey: function (survey, surveyContainer) {
      var emailSurveyTemplate = userSurveys.getEmailSurveyTemplate()
      surveyContainer.append(emailSurveyTemplate.render(survey))
      userSurveys.setEmailSurveyEventHandlers(survey)
    },

    addParamsToURL: function (surveyUrl) {
      var newSurveyUrl = surveyUrl.replace(/\{\{currentPath\}\}/g, userSurveys.currentPath());
      if (surveyUrl.indexOf("?c=") !== -1) {
        return newSurveyUrl + "&gcl=" + GOVUK.analytics.gaClientId;
      }
      else {
        return newSurveyUrl + "?gcl=" + GOVUK.analytics.gaClientId;
      }
    },

    setEmailSurveyEventHandlers: function (survey) {
      var $emailSurveyOpen = $('#email-survey-open')
      var $emailSurveyCancel = $('#user-survey-cancel')
      var $emailSurveyPre = $('#email-survey-pre')
      var $emailSurveyForm = $('#email-survey-form')
      var $emailSurveyPostSuccess = $('#email-survey-post-success')
      var $emailSurveyPostFailure = $('#email-survey-post-failure')
      var $emailSurveyField = $('#survey-email-address')
      var $takeSurvey = $('#take-survey')

      $takeSurvey.click(function () {
        userSurveys.setSurveyTakenCookie(survey)
        userSurveys.hideSurvey(survey)
        userSurveys.trackEvent(survey.identifier, 'no_email_link', 'User taken survey via no email link')
      })

      $emailSurveyOpen.click(function (e) {
        survey.surveyExpanded = true
        userSurveys.trackEvent(survey.identifier, 'email_survey_open', 'Email survey opened')
        $emailSurveyPre.addClass('js-hidden').attr('aria-hidden', 'true')
        $emailSurveyForm.removeClass('js-hidden').attr('aria-hidden', 'false')
        $emailSurveyField.focus()
        e.stopPropagation()
        return false
      })

      $emailSurveyCancel.click(function (e) {
        userSurveys.setSurveyTakenCookie(survey)
        userSurveys.hideSurvey(survey)
        if (survey.surveyExpanded) {
          userSurveys.trackEvent(survey.identifier, 'email_survey_cancel', 'Email survey cancelled')
        } else {
          userSurveys.trackEvent(survey.identifier, 'banner_no_thanks', 'No thanks clicked')
        }
        e.stopPropagation()
        return false
      })

      $emailSurveyForm.submit(function (e) {
        var successCallback = function () {
          $emailSurveyForm.addClass('js-hidden').attr('aria-hidden', 'true')
          $emailSurveyPostSuccess.removeClass('js-hidden').attr('aria-hidden', 'false')
          $emailSurveyPostSuccess.focus()
          userSurveys.setSurveyTakenCookie(survey)
          userSurveys.trackEvent(survey.identifier, 'email_survey_taken', 'Email survey taken')
          userSurveys.trackEvent(survey.identifier, 'banner_taken', 'User taken survey')
        }
        var errorCallback = function () {
          $emailSurveyForm.addClass('js-hidden').attr('aria-hidden', 'true')
          $emailSurveyPostFailure.removeClass('js-hidden').attr('aria-hidden', 'false')
          $emailSurveyPostFailure.focus()
        }
        var surveyFormUrl = $emailSurveyForm.attr('action')
        // make sure the survey form is a js url
        if (!(/\.js$/.test(surveyFormUrl))) {
          surveyFormUrl += '.js'
        }

        $.ajax({
          type: 'POST',
          url: surveyFormUrl,
          dataType: 'json',
          data: $emailSurveyForm.serialize(),
          success: successCallback,
          error: errorCallback,
          statusCode: {
            500: errorCallback
          }
        })
        e.stopPropagation()
        return false
      })
    },

    setURLSurveyEventHandlers: function (survey) {
      var $emailSurveyCancel = $('#user-survey-cancel')
      var $takeSurvey = $('#take-survey')

      $emailSurveyCancel.click(function (e) {
        userSurveys.setSurveyTakenCookie(survey)
        userSurveys.hideSurvey(survey)
        userSurveys.trackEvent(survey.identifier, 'banner_no_thanks', 'No thanks clicked')
        e.stopPropagation()
        return false
      })
      $takeSurvey.click(function () {
        userSurveys.setSurveyTakenCookie(survey)
        userSurveys.hideSurvey(survey)
        userSurveys.trackEvent(survey.identifier, 'banner_taken', 'User taken survey')
      })
    },

    isSurveyToBeDisplayed: function (survey) {
      if (userSurveys.isBeingViewedOnMobile() && !userSurveys.surveyIsAllowedOnMobile(survey)) {
        return false
      } else if (GOVUK.cookie(userSurveys.surveyTakenCookieName(survey)) === 'true') {
        return false
      } else if (userSurveys.surveyHasBeenSeenTooManyTimes(survey)) {
        return false
      } else {
        return userSurveys.randomNumberMatches(survey.frequency)
      }
    },

    pathInBlacklist: function () {
      var blackList = new RegExp('^/(?:' +
        /service-manual/.source +
        // add more blacklist paths in the form:
        // + /|path-to\/blacklist/.source
        ')(?:\/|$)'
      )
      return blackList.test(userSurveys.currentPath())
    },

    userCompletedTransaction: function () {
      var path = userSurveys.currentPath()

      function stringContains (str, substr) {
        return str.indexOf(substr) > -1
      }

      if (stringContains(path, '/done') ||
          stringContains(path, '/transaction-finished') ||
          stringContains(path, '/driving-transaction-finished')) {
        return true
      }
    },

    trackEvent: function (identifier, action, label) {
      window.GOVUK.analytics.trackEvent(identifier, action, {
        label: label,
        value: 1,
        nonInteraction: true
      })
    },

    setSurveyTakenCookie: function (survey) {
      window.GOVUK.cookie(userSurveys.surveyTakenCookieName(survey), true, { days: 30 * 3 })
    },

    incrementSurveySeenCounter: function (survey) {
      var cookieName = userSurveys.surveySeenCookieName(survey)
      var seenCount = (userSurveys.surveySeenCount(survey) + 1)
      var cooloff = userSurveys.seenTooManyTimesCooloff(survey)
      if (cooloff) {
        window.GOVUK.cookie(cookieName, seenCount, { days: cooloff })
      } else {
        window.GOVUK.cookie(cookieName, seenCount, { days: 365 * 2 })
      }
    },

    seenTooManyTimesCooloff: function (survey) {
      if (survey.seenTooManyTimesCooloff) {
        return extractNumber(survey.seenTooManyTimesCooloff, undefined, 1)
      } else {
        return undefined
      }
    },

    hideSurvey: function (_survey) {
      $('#user-satisfaction-survey').removeClass('visible').attr('aria-hidden', 'true')
    },

    randomNumberMatches: function (frequency) {
      return (Math.floor(Math.random() * frequency) === 0)
    },

    getSurveyUrl: function(survey) {
      if (survey.url instanceof Array) {
        return survey.url[Math.floor(Math.random() * survey.url.length)]
      } else {
        return survey.url
      }
    },

    otherNotificationVisible: function () {
      var notificationIds = [
        '.govuk-emergency-banner:visible',
        '#global-cookie-message:visible',
        '#global-browser-prompt:visible',
        '#taxonomy-survey:visible'
      ]
      return $(notificationIds.join(', ')).length > 0
    },

    surveyHasBeenSeenTooManyTimes: function (survey) {
      return (userSurveys.surveySeenCount(survey) >= userSurveys.surveySeenTooManyTimesLimit(survey))
    },

    surveySeenTooManyTimesLimit: function (survey) {
      var limitValue = survey.seenTooManyTimesLimit
      if (String(limitValue).toLowerCase() === 'unlimited') {
        return Infinity
      } else {
        return extractNumber(limitValue, SURVEY_SEEN_TOO_MANY_TIMES_LIMIT, 1)
      }
    },

    surveySeenCount: function (survey) {
      return extractNumber(GOVUK.cookie(userSurveys.surveySeenCookieName(survey)), 0, 0)
    },

    surveyTakenCookieName: function (survey) {
      return generateCookieName('taken_' + survey.identifier)
    },

    surveySeenCookieName: function (survey) {
      return generateCookieName('survey_seen_' + survey.identifier)
    },

    isBeingViewedOnMobile: function () {
      return window.matchMedia(MAX_MOBILE_WIDTH).matches
    },

    surveyIsAllowedOnMobile: function (survey) {
      return survey.hasOwnProperty('allowedOnMobile') && survey.allowedOnMobile === true
    },

    pathMatch: function (paths) {
      if (paths === undefined) {
        return false
      } else {
        var pathMatchingExpr = new RegExp(
              $.map($.makeArray(paths), function (path, _i) {
                if (/[\^\$]/.test(path)) {
                  return '(?:' + path + ')'
                } else {
                  return '(?:\/' + path + '(?:\/|$))'
                }
              }).join('|')
            )
        return pathMatchingExpr.test(userSurveys.currentPath())
      }
    },

    breadcrumbMatch: function (breadcrumbs) {
      if (breadcrumbs === undefined) {
        return false
      } else {
        var breadcrumbMatchingExpr = new RegExp($.makeArray(breadcrumbs).join('|'), 'i')
        return breadcrumbMatchingExpr.test(userSurveys.currentBreadcrumb())
      }
    },

    sectionMatch: function (sections) {
      if (sections === undefined) {
        return false
      } else {
        var sectionMatchingExpr = new RegExp($.makeArray(sections).join('|'), 'i')
        return sectionMatchingExpr.test(userSurveys.currentSection()) || sectionMatchingExpr.test(userSurveys.currentThemes())
      }
    },

    organisationMatch: function (organisations) {
      if (organisations === undefined) {
        return false
      } else {
        var orgMatchingExpr = new RegExp($.makeArray(organisations).join('|'))
        return orgMatchingExpr.test(userSurveys.currentOrganisation())
      }
    },

    tlsCookieMatch: function (tlsCookieVersionLimit) {
      var currentTlsVersion = userSurveys.currentTlsVersion()
      if (tlsCookieVersionLimit === undefined || currentTlsVersion == '') {
        return false
      } else {
        return currentTlsVersion < tlsCookieVersionLimit[0]
      }
    },

    activeWhen: function (survey) {
      if (survey.hasOwnProperty('activeWhen')) {
        if (survey.activeWhen.hasOwnProperty('path') ||
          survey.activeWhen.hasOwnProperty('breadcrumb') ||
          survey.activeWhen.hasOwnProperty('section') ||
          survey.activeWhen.hasOwnProperty('organisation') ||
          survey.activeWhen.hasOwnProperty('tlsCookieVersionLimit')) {
          var matchType = (survey.activeWhen.matchType || 'include')
          var matchByTlsCookie = userSurveys.tlsCookieMatch(survey.activeWhen.tlsCookieVersionLimit)
          var matchByPath = userSurveys.pathMatch(survey.activeWhen.path)
          var matchByBreadcrumb = userSurveys.breadcrumbMatch(survey.activeWhen.breadcrumb)
          var matchBySection = userSurveys.sectionMatch(survey.activeWhen.section)
          var matchByOrganisation = userSurveys.organisationMatch(survey.activeWhen.organisation)
          var pageMatches = (matchByTlsCookie || matchByPath || matchByBreadcrumb || matchBySection || matchByOrganisation)

          if (matchType !== 'exclude') {
            return pageMatches
          } else {
            return !pageMatches
          }
        } else {
          return true
        }
      } else {
        return true
      }
    },

    currentTime: function () { return new Date().getTime() },
    currentPath: function () { return window.location.pathname },
    currentBreadcrumb: function () { return $('.gem-c-breadcrumbs').text() || '' },
    currentSection: function () { return $('meta[name="govuk:section"]').attr('content') || '' },
    currentThemes: function () { return $('meta[name="govuk:themes"]').attr('content') || '' },
    currentOrganisation: function () { return $('meta[name="govuk:analytics:organisations"]').attr('content') || '' },
    currentTlsVersion: function () {
      var tlsCookie = GOVUK.getCookie('TLSversion')
      if (tlsCookie == null || tlsCookie == "unknown") {
        return ''
      } else {
        var cookieVersion = parseFloat(tlsCookie.replace('TLSv', ''))
        return cookieVersion || ''
      }
    }
  }

  var generateCookieName = function (cookieName) {
      // taken_user_satisfaction_survey => takenUserSatisfactionSurvey
    var cookieStub = cookieName.replace(/(\_\w)/g, function (m) {
      return m.charAt(1).toUpperCase()
    })
    return 'govuk_' + cookieStub
  }

  var extractNumber = function (value, defaultValue, limit) {
    var parsedValue = parseInt(value, 10)
    if (isNaN(parsedValue) || (parsedValue < limit)) {
      return defaultValue
    } else {
      return parsedValue
    }
  }

  window.GOVUK.userSurveys = userSurveys

  $(document).ready(function () {
    if (GOVUK.userSurveys) {
      if (GOVUK.analytics && GOVUK.analytics.gaClientId) {
        window.GOVUK.userSurveys.init()
      }
      else {
        $(window).on('gaClientSet', function() {
          window.GOVUK.userSurveys.init()
        })
      }
    }
  })
})(window.jQuery)
