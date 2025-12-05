import { SOPCollection } from './types';

export const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Acme Corp' },
  { id: 'c2', name: 'TechStart Inc' },
  { id: 'c3', name: 'Global Goods' },
  { id: 'c4', name: 'Local Bakery' },
  { id: 'c5', name: 'Nordic Design' },
];

export const INITIAL_DATA: SOPCollection = [
  {
    id: 'seo',
    title: 'SEO',
    icon: 'Search',
    description: 'Search Engine Optimization standard operating procedures and phase blocks.',
    updatedAt: new Date().toISOString(),
    phases: [
      {
        id: 'p1',
        title: 'Learning Process',
        phaseNumber: 1,
        description: 'Initial discovery and analysis phase.',
        steps: [
          { id: '1.1', code: '1.1', title: 'Questions', content: '## 1.1 Questions\n\n- Client onboarding questionnaire\n- Business goal alignment\n- Target audience identification', status: 'completed' },
          { id: '1.2', code: '1.2', title: 'Analysis', content: '## 1.2 Analysis\n\n- Current traffic analysis\n- Conversion rate baseline\n- Historical data review', status: 'completed' },
          { id: '1.3', code: '1.3', title: 'Competitors', content: '## 1.3 Competitors\n\n- Identify top 5 organic competitors\n- Analyze competitor backlink profile\n- Content gap analysis', status: 'pending' },
          { id: '1.4', code: '1.4', title: 'Planning', content: '## 1.4 Planning\n\n- Roadmap creation\n- Resource allocation\n- KPI setting', status: 'pending' },
        ]
      },
      {
        id: 'p2',
        title: 'Improving Process',
        phaseNumber: 2,
        description: 'Technical and structural optimization.',
        steps: [
          { id: '2.1', code: '2.1', title: 'Website Quality Audit', content: '## 2.1 Website Quality Audit\n\n- E-E-A-T assessment\n- Trust signals check\n- Contact info verification', status: 'pending' },
          { id: '2.2', code: '2.2', title: 'Technical SEO Audit', content: '## 2.2 Technical SEO Audit\n\n- Crawl error resolution\n- Core Web Vitals check\n- XML Sitemap & Robots.txt', status: 'pending' },
          { id: '2.3', code: '2.3', title: 'Keyword Research', content: '## 2.3 Keyword Research\n\n- Seed keyword identification\n- Long-tail opportunity mapping\n- Search intent classification', status: 'pending' },
          { id: '2.4', code: '2.4', title: 'Target Pages', content: '## 2.4 Target Pages\n\n- Mapping keywords to URLs\n- Identifying cannibalization issues', status: 'pending' },
          { id: '2.5', code: '2.5', title: '"On Page" / UX', content: '## 2.5 On Page & UX\n\n- Title tag & Meta description optimization\n- Heading structure (H1-H6)\n- Internal linking strategy', status: 'pending' },
        ]
      },
      {
        id: 'p3',
        title: 'Building Process',
        phaseNumber: 3,
        description: 'Content creation and asset development.',
        steps: [
          { id: '3.1', code: '3.1', title: 'Content Audit', content: '## 3.1 Content Audit\n\n- ROT Analysis (Redundant, Outdated, Trivial)\n- Content consolidation strategy', status: 'pending' },
          { id: '3.2', code: '3.2', title: 'KW Gap Analysis', content: '## 3.2 Keyword Gap Analysis\n\n- Identify keywords competitors rank for but we do not.', status: 'pending' },
          { id: '3.3', code: '3.3', title: 'Content Strategy', content: '## 3.3 Content Strategy\n\n- Editorial calendar creation\n- Writer briefing templates', status: 'pending' },
          { id: '3.4', code: '3.4', title: 'New Topic Ideation', content: '## 3.4 New Topic Ideation\n\n- Trending topics\n- FAQ schema opportunities', status: 'pending' },
          { id: '3.5', code: '3.5', title: 'Content Management', content: '## 3.5 Content Management\n\n- Publishing workflow\n- CMS formatting standards', status: 'pending' },
        ]
      },
      {
        id: 'p4',
        title: 'Promoting Process',
        phaseNumber: 4,
        description: 'Off-page SEO and authority building.',
        steps: [
          { id: '4.1', code: '4.1', title: 'Strategy & Analysis', content: '## 4.1 Strategy & Analysis\n\n- Link velocity planning\n- Anchor text profile analysis', status: 'pending' },
          { id: '4.2', code: '4.2', title: 'Prospecting', content: '## 4.2 Prospecting\n\n- Identifying relevant industry blogs\n- Resource page opportunities', status: 'pending' },
          { id: '4.3', code: '4.3', title: 'Outreach', content: '## 4.3 Outreach\n\n- Email template creation\n- Relationship building', status: 'pending' },
          { id: '4.4', code: '4.4', title: 'Link Management', content: '## 4.4 Link Management\n\n- Monitoring acquired links\n- Disavow file management', status: 'pending' },
        ]
      },
      {
        id: 'p5',
        title: 'Evaluating Process',
        phaseNumber: 5,
        description: 'Review, reporting and scaling.',
        steps: [
          { id: '5.1', code: '5.1', title: 'Data Aggregation', content: '## 5.1 Data Aggregation\n\n- GSC & GA4 data blending\n- Rank tracking updates', status: 'pending' },
          { id: '5.2', code: '5.2', title: 'Reporting', content: '## 5.2 Reporting\n\n- Monthly performance deck\n- ROI calculation', status: 'pending' },
          { id: '5.3', code: '5.3', title: 'Testing', content: '## 5.3 Testing\n\n- A/B testing meta tags\n- CRO experiments', status: 'pending' },
          { id: '5.4', code: '5.4', title: 'Scaling', content: '## 5.4 Scaling\n\n- Identifying successful patterns\n- expanding into new verticals', status: 'pending' },
        ]
      }
    ]
  },
  {
    id: 'google-ads',
    title: 'Google Ads',
    icon: 'MousePointerClick',
    description: 'PPC campaign management structure based on Makeable Phases.',
    updatedAt: new Date().toISOString(),
    phases: [
        {
            id: 'ga-p1',
            title: 'Learning Process',
            phaseNumber: 1,
            description: 'Identify customer expectations and gather initial data.',
            steps: [
                { id: 'ga-1.1', code: '1.1', title: 'Questions', content: '# 1.1 Questions\n\n**Description:**\nIdentify the customer\'s expectations of the cooperation and the work to be carried out. Identify their PCM score.\n\n**Input:**\n- The questioner\n- The domain\n- The contact information\n\n**Process:**\n- The goal of the campaign (awareness, leads, conversions)\n- 3 main competitors\n- Timeframe and monthly budget\n- Reporting setup\n- Keywords to target\n\n**Output:**\n- Report Card in Google Spreadsheet', status: 'pending' },
                { id: 'ga-1.2', code: '1.2', title: 'Analysis', content: '# 1.2 Analysis\n\n**Description:**\nIdentify the content on the homepage that is working today and content not producing results via GDS report.\n\n**Input:**\n- Access to GA & GSC\n- Prior work in area\n\n**Process:**\n- Connect Data GA & GSC to Google Data Studio\n- Entry points to the site\n- Sticky pages\n- Exit points\n- Conversion pages\n\n**Output:**\n- Summary report on what seems to work', status: 'pending' },
                { id: 'ga-1.3', code: '1.3', title: 'Competitors', content: '# 1.3 Competitors\n\n**Description:**\nGet the insights that competitors are doing online and detect current market trends.\n\n**Input:**\n- Domains of most feared competitors\n\n**Process:**\n- Use Google Ads / SEMRush\n- Analyze remarketing efforts\n- Identify special content types (pdf, video, etc)\n\n**Output:**\n- Competitor tactics summary report\n- Industry trends report', status: 'pending' },
                { id: 'ga-1.4', code: '1.4', title: 'Planning', content: '# 1.4 Planning\n\n**Description:**\nGet activities, time, and responsibilities into the Gantt chart.\n\n**Input:**\n- Customer answers\n- Site affairs\n- Competitor tactics\n\n**Process:**\n- Gap analysis\n- Cost and effect analysis (Low hanging fruits)\n- Plotting variables in Gantt chart\n\n**Output:**\n- Timetable of activities\n- Google Spreadsheet Gantt chart', status: 'pending' },
            ]
        },
        {
            id: 'ga-p2',
            title: 'Improving Process',
            phaseNumber: 2,
            description: 'Audit and optimization of existing structures.',
            steps: [
                { id: 'ga-2.1', code: '2.1', title: 'Account Audit', content: '# 2.1 Account Audit\n\n**Description:**\nCheck if the account is live and goals are connected to Google Analytics.\n\n**Process:**\n- Check payment setup\n- Verify goal tracking in GA\n- Verify goal connection to Adwords\n\n**Output:**\n- List of completed improvements', status: 'pending' },
                { id: 'ga-2.2', code: '2.2', title: 'Campaign Structure', content: '# 2.2 Campaign Structure\n\n**Description:**\nCheck if campaign structure is setup correctly.\n\n**Process:**\n- Are we using Campaigns?\n- Are we tracking performance correctly?\n- Can we pause poor campaigns?\n\n**Output:**\n- List of potential improvements', status: 'pending' },
                { id: 'ga-2.3', code: '2.3', title: 'Landing Page', content: '# 2.3 Landing Page\n\n**Description:**\nCheck if landing page is holding visitors and matches ads.\n\n**Process:**\n- Tracking traffic from Adwords to LP\n- Bounce rate / Avg page session\n- Keyword on page analysis\n- Sticky elements (video)\n\n**Output:**\n- Suggestions for LP 2.0', status: 'pending' },
                { id: 'ga-2.4', code: '2.4', title: 'Keywords', content: '# 2.4 Keywords\n\n**Description:**\nAre we using keywords in a correct way?\n\n**Process:**\n- Cross-reference with SEO keywords\n- Negative keyword list check\n- Quality score script setup\n- Match types check\n\n**Output:**\n- List of keyword improvements', status: 'pending' },
                { id: 'ga-2.5', code: '2.5', title: 'Ads', content: '# 2.5 Ads\n\n**Description:**\nDo we have any improvement on the ads department?\n\n**Process:**\n- Ngram to find % CTR gold\n- PCM setup check\n- Create variations (A/B testing)\n\n**Output:**\n- Test sheet to track changes', status: 'pending' },
            ]
        },
        {
            id: 'ga-p3',
            title: 'Building Process',
            phaseNumber: 3,
            description: 'Setup and creation of new assets.',
            steps: [
                { id: 'ga-3.1', code: '3.1', title: 'Account Setup', content: '# 3.1 Account Setup\n\n**Description:**\nGetting all access to Adwords, GTM, and setup connection to GA.\n\n**Process:**\n- Get access to programs\n- Goal setup (awareness, leads, conversions)\n- Reporting setup\n\n**Output:**\n- Report Card', status: 'pending' },
                { id: 'ga-3.2', code: '3.2', title: 'Campaign Structure', content: '# 3.2 Campaign Structure\n\n**Description:**\nSetup the campaigns.\n\n**Process:**\n- Setup different campaigns\n- Budget\n- Ads\n- Keywords (matches)\n- Negative keywords\n- Bid-strategy\n\n**Output:**\n- List of campaigns and frame to build on', status: 'pending' },
                { id: 'ga-3.3', code: '3.3', title: 'Landing Page', content: '# 3.3 Landing Page\n\n**Description:**\nCheck tracking and match with ads.\n\n**Process:**\n- Setup tracking traffic\n- Text analysis\n\n**Output:**\n- Tracking and new pages', status: 'pending' },
                { id: 'ga-3.4', code: '3.4', title: 'Keywords', content: '# 3.4 Keywords\n\n**Description:**\nKeyword usage and expansion.\n\n**Process:**\n- Use keywords from SEO\n- Quality score script\n- Customer journey keywords\n\n**Output:**\n- New keyword list', status: 'pending' },
                { id: 'ga-3.5', code: '3.5', title: 'Ads', content: '# 3.5 Ads\n\n**Description:**\nAd creation and variations.\n\n**Process:**\n- Get ideas from competing ads\n- Create variations\n- Test A/B\n\n**Output:**\n- Suggestions', status: 'pending' },
            ]
        },
        {
            id: 'ga-p4',
            title: 'Evaluation Process',
            phaseNumber: 4,
            description: 'Data aggregation, reporting, and scaling.',
            steps: [
                { id: 'ga-4.1', code: '4.1', title: 'Data Aggregation', content: '# 4.1 Data Aggregation\n\n**Description:**\nGet all data points to lineup.\n\n**Process:**\n- Access data in Google Data Studio\n\n**Output:**\n- Data access to GDS', status: 'pending' },
                { id: 'ga-4.2', code: '4.2', title: 'Reporting', content: '# 4.2 Reporting\n\n**Description:**\nFollow traffic, PPC and conversion rate.\n\n**Process:**\n- Connect template to data source\n- Set receiver and schedule\n\n**Output:**\n- Monthly report\n- Special report', status: 'pending' },
                { id: 'ga-4.3', code: '4.3', title: 'Testing', content: '# 4.3 Testing\n\n**Description:**\nMake test and setup tracking.\n\n**Process:**\n- Make test (lower cps or increase conversion rate)\n- Adwords log of test\n- Setup Google Anomaly Script\n\n**Output:**\n- List of tests running\n- Pause bad tests', status: 'pending' },
                { id: 'ga-4.4', code: '4.4', title: 'Scaling', content: '# 4.4 Scaling\n\n**Description:**\nDo more of the success.\n\n**Process:**\n- Find good test to scale\n- Make new campaign\n- Make new tweet to bidding\n- Add new keywords\n\n**Output:**\n- Test log', status: 'pending' },
            ]
        }
    ]
  },
  {
    id: 'fb-ads',
    title: 'Facebook Ads',
    icon: 'Facebook',
    description: 'Social media advertising workflows (Makeable Framework).',
    updatedAt: new Date().toISOString(),
    phases: [
        {
            id: 'fb-p1',
            title: 'Learning Process',
            phaseNumber: 1,
            description: 'Initial discovery and analysis phase.',
            steps: [
                { id: 'fb-1.1', code: '1.1', title: 'Questions', content: '# 1.1 Questions (Facebook)\n\nIdentify client expectations and audience targeting for social.', status: 'pending' },
                { id: 'fb-1.2', code: '1.2', title: 'Analysis', content: '# 1.2 Analysis (Facebook)\n\nReview historical Pixel data and audience insights.', status: 'pending' },
                { id: 'fb-1.3', code: '1.3', title: 'Competitors', content: '# 1.3 Competitors\n\nReview Facebook Ad Library for competitor creatives.', status: 'pending' },
                { id: 'fb-1.4', code: '1.4', title: 'Planning', content: '# 1.4 Planning\n\nCreative roadmap and budget allocation.', status: 'pending' },
            ]
        },
        {
            id: 'fb-p2',
            title: 'Improving Process',
            phaseNumber: 2,
            description: 'Optimization of existing campaigns.',
            steps: [
                { id: 'fb-2.1', code: '2.1', title: 'Account Audit', content: '# 2.1 Audit\n\nPixel verification and event match quality check.', status: 'pending' },
                { id: 'fb-2.2', code: '2.2', title: 'Campaign Structure', content: '# 2.2 Structure\n\nCBO vs ABO analysis.', status: 'pending' },
                { id: 'fb-2.3', code: '2.3', title: 'Landing Page', content: '# 2.3 Landing Page\n\nMobile optimization check.', status: 'pending' },
                { id: 'fb-2.4', code: '2.4', title: 'Audiences', content: '# 2.4 Audiences\n\nLookalike and retargeting health check.', status: 'pending' },
                { id: 'fb-2.5', code: '2.5', title: 'Ads', content: '# 2.5 Creatives\n\nCreative fatigue analysis.', status: 'pending' },
            ]
        },
        {
            id: 'fb-p3',
            title: 'Building Process',
            phaseNumber: 3,
            description: 'Setup and creation.',
            steps: [
                { id: 'fb-3.1', code: '3.1', title: 'Account Setup', content: '# 3.1 Setup\n\nBusiness Manager configuration.', status: 'pending' },
                { id: 'fb-3.2', code: '3.2', title: 'Campaign Structure', content: '# 3.2 Structure\n\nFull funnel setup (TOF/MOF/BOF).', status: 'pending' },
                { id: 'fb-3.3', code: '3.3', title: 'Landing Page', content: '# 3.3 Landing Page\n\nPixel event implementation.', status: 'pending' },
                { id: 'fb-3.4', code: '3.4', title: 'Audiences', content: '# 3.4 Audiences\n\nCustom audience uploads.', status: 'pending' },
                { id: 'fb-3.5', code: '3.5', title: 'Ads', content: '# 3.5 Creatives\n\nUpload and format verification.', status: 'pending' },
            ]
        },
        {
            id: 'fb-p4',
            title: 'Evaluation Process',
            phaseNumber: 4,
            description: 'Review and scaling.',
            steps: [
                { id: 'fb-4.1', code: '4.1', title: 'Data Aggregation', content: '# 4.1 Data\n\nAttribution window review.', status: 'pending' },
                { id: 'fb-4.2', code: '4.2', title: 'Reporting', content: '# 4.2 Reporting\n\nROAS reporting.', status: 'pending' },
                { id: 'fb-4.3', code: '4.3', title: 'Testing', content: '# 4.3 Testing\n\nCreative A/B tests.', status: 'pending' },
                { id: 'fb-4.4', code: '4.4', title: 'Scaling', content: '# 4.4 Scaling\n\nVertical scaling strategies.', status: 'pending' },
            ]
        }
    ]
  },
  {
    id: 'linkedin-ads',
    title: 'LinkedIn Ads',
    icon: 'Linkedin',
    description: 'B2B lead generation campaigns (Makeable Framework).',
    updatedAt: new Date().toISOString(),
    phases: [
        {
            id: 'li-p1',
            title: 'Learning Process',
            phaseNumber: 1,
            description: 'Initial discovery and analysis phase.',
            steps: [
                { id: 'li-1.1', code: '1.1', title: 'Questions', content: '# 1.1 Questions\n\nIdeal Customer Profile (ICP) definition.', status: 'pending' },
                { id: 'li-1.2', code: '1.2', title: 'Analysis', content: '# 1.2 Analysis\n\nCompany page analysis.', status: 'pending' },
                { id: 'li-1.3', code: '1.3', title: 'Competitors', content: '# 1.3 Competitors\n\nCompetitor content strategy review.', status: 'pending' },
                { id: 'li-1.4', code: '1.4', title: 'Planning', content: '# 1.4 Planning\n\nContent asset mapping.', status: 'pending' },
            ]
        },
        {
            id: 'li-p2',
            title: 'Improving Process',
            phaseNumber: 2,
            description: 'Optimization of existing campaigns.',
            steps: [
                { id: 'li-2.1', code: '2.1', title: 'Account Audit', content: '# 2.1 Audit\n\nInsight tag verification.', status: 'pending' },
                { id: 'li-2.2', code: '2.2', title: 'Campaign Structure', content: '# 2.2 Structure\n\nObjective alignment check.', status: 'pending' },
                { id: 'li-2.3', code: '2.3', title: 'Landing Page', content: '# 2.3 Landing Page\n\nLead Gen Form vs Website validation.', status: 'pending' },
                { id: 'li-2.4', code: '2.4', title: 'Targeting', content: '# 2.4 Targeting\n\nAudience size and attribute refinement.', status: 'pending' },
                { id: 'li-2.5', code: '2.5', title: 'Ads', content: '# 2.5 Ads\n\nSponsored content review.', status: 'pending' },
            ]
        },
        {
            id: 'li-p3',
            title: 'Building Process',
            phaseNumber: 3,
            description: 'Setup and creation.',
            steps: [
                { id: 'li-3.1', code: '3.1', title: 'Account Setup', content: '# 3.1 Setup\n\nCampaign Manager setup.', status: 'pending' },
                { id: 'li-3.2', code: '3.2', title: 'Campaign Structure', content: '# 3.2 Structure\n\nCampaign group hierarchy.', status: 'pending' },
                { id: 'li-3.3', code: '3.3', title: 'Landing Page', content: '# 3.3 Landing Page\n\nLead magnet setup.', status: 'pending' },
                { id: 'li-3.4', code: '3.4', title: 'Targeting', content: '# 3.4 Targeting\n\nMatched audiences upload.', status: 'pending' },
                { id: 'li-3.5', code: '3.5', title: 'Ads', content: '# 3.5 Ads\n\nCreative asset creation.', status: 'pending' },
            ]
        },
        {
            id: 'li-p4',
            title: 'Evaluation Process',
            phaseNumber: 4,
            description: 'Review and scaling.',
            steps: [
                { id: 'li-4.1', code: '4.1', title: 'Data Aggregation', content: '# 4.1 Data\n\nDemographic reporting.', status: 'pending' },
                { id: 'li-4.2', code: '4.2', title: 'Reporting', content: '# 4.2 Reporting\n\nCost per Lead (CPL) analysis.', status: 'pending' },
                { id: 'li-4.3', code: '4.3', title: 'Testing', content: '# 4.3 Testing\n\nAudience segment testing.', status: 'pending' },
                { id: 'li-4.4', code: '4.4', title: 'Scaling', content: '# 4.4 Scaling\n\nBudget expansion strategies.', status: 'pending' },
            ]
        }
    ]
  },
  {
    id: 'conversion',
    title: 'Conversion',
    icon: 'Zap',
    description: 'CRO and landing page optimization (Makeable Framework).',
    updatedAt: new Date().toISOString(),
    phases: [
        {
            id: 'cro-p1',
            title: 'Learning Process',
            phaseNumber: 1,
            description: 'Behavior analysis and hypothesis generation.',
            steps: [
                { id: 'cro-1.1', code: '1.1', title: 'Questions', content: '# 1.1 Questions\n\nUnderstand conversion goals and friction points.', status: 'pending' },
                { id: 'cro-1.2', code: '1.2', title: 'Analysis', content: '# 1.2 Analysis\n\n**Tools:**\n- Hotjar Heatmaps\n- GA4 Funnel Analysis\n- Session Recordings\n\n**Output:**\nBehavioral insights report.', status: 'pending' },
                { id: 'cro-1.3', code: '1.3', title: 'Competitors', content: '# 1.3 Competitors\n\nUX benchmarking against top 3 competitors.', status: 'pending' },
                { id: 'cro-1.4', code: '1.4', title: 'Planning', content: '# 1.4 Planning\n\nHypothesis backlog and prioritization (PIE framework).', status: 'pending' },
            ]
        },
        {
            id: 'cro-p2',
            title: 'Improving Process',
            phaseNumber: 2,
            description: 'Pre-test optimization and quick wins.',
            steps: [
                { id: 'cro-2.1', code: '2.1', title: 'UX Audit', content: '# 2.1 UX Audit\n\nHeuristic evaluation of key user flows.', status: 'pending' },
                { id: 'cro-2.2', code: '2.2', title: 'Speed Optimization', content: '# 2.2 Speed\n\nCore Web Vitals assessment and improvement.', status: 'pending' },
                { id: 'cro-2.3', code: '2.3', title: 'Copywriting', content: '# 2.3 Copywriting\n\nValue proposition and CTA clarity check.', status: 'pending' },
                { id: 'cro-2.4', code: '2.4', title: 'Trust Signals', content: '# 2.4 Trust\n\nReview social proof, badges, and testimonials placement.', status: 'pending' },
            ]
        },
        {
            id: 'cro-p3',
            title: 'Building Process',
            phaseNumber: 3,
            description: 'Test design and implementation.',
            steps: [
                { id: 'cro-3.1', code: '3.1', title: 'Tracking Setup', content: '# 3.1 Tracking\n\nEvent tagging and goal configuration in GTM.', status: 'pending' },
                { id: 'cro-3.2', code: '3.2', title: 'Variant Design', content: '# 3.2 Design\n\nWireframing and high-fidelity design of test variants.', status: 'pending' },
                { id: 'cro-3.3', code: '3.3', title: 'Implementation', content: '# 3.3 Implementation\n\nSetup A/B test in VWO/Google Optimize/Convert.', status: 'pending' },
            ]
        },
        {
            id: 'cro-p4',
            title: 'Evaluation Process',
            phaseNumber: 4,
            description: 'Analysis and scale.',
            steps: [
                { id: 'cro-4.1', code: '4.1', title: 'Data Aggregation', content: '# 4.1 Data\n\nStatistical significance calculation.', status: 'pending' },
                { id: 'cro-4.2', code: '4.2', title: 'Reporting', content: '# 4.2 Reporting\n\nWin/Loss analysis and learning documentation.', status: 'pending' },
                { id: 'cro-4.3', code: '4.3', title: 'Scaling', content: '# 4.3 Scaling\n\nApplying winning patterns to other pages.', status: 'pending' },
            ]
        }
    ]
  },
  {
    id: 'local-seo',
    title: 'Local SEO',
    icon: 'MapPin',
    description: 'GMB and local citation management (Makeable Framework).',
    updatedAt: new Date().toISOString(),
    phases: [
        {
            id: 'local-p1',
            title: 'Learning Process',
            phaseNumber: 1,
            description: 'Local presence discovery.',
            steps: [
                { id: 'local-1.1', code: '1.1', title: 'Questions', content: '# 1.1 Questions\n\nDefine service areas and NAP (Name, Address, Phone) standards.', status: 'pending' },
                { id: 'local-1.2', code: '1.2', title: 'Analysis', content: '# 1.2 Analysis\n\nCurrent local rank grid analysis.', status: 'pending' },
                { id: 'local-1.3', code: '1.3', title: 'Competitors', content: '# 1.3 Competitors\n\nLocal Pack competitor audit (categories, reviews).', status: 'pending' },
                { id: 'local-1.4', code: '1.4', title: 'Planning', content: '# 1.4 Planning\n\nCitation and review velocity strategy.', status: 'pending' },
            ]
        },
        {
            id: 'local-p2',
            title: 'Improving Process',
            phaseNumber: 2,
            description: 'Profile and site optimization.',
            steps: [
                { id: 'local-2.1', code: '2.1', title: 'GMB Audit', content: '# 2.1 GMB Audit\n\nProfile completeness, primary category, and attributes check.', status: 'pending' },
                { id: 'local-2.2', code: '2.2', title: 'On-Page Local', content: '# 2.2 On-Page\n\nLocation pages and Local Schema markup implementation.', status: 'pending' },
                { id: 'local-2.3', code: '2.3', title: 'Citations', content: '# 2.3 Citations\n\nAudit and cleanup of incorrect directory listings.', status: 'pending' },
            ]
        },
        {
            id: 'local-p3',
            title: 'Building Process',
            phaseNumber: 3,
            description: 'Authority building.',
            steps: [
                { id: 'local-3.1', code: '3.1', title: 'New Citations', content: '# 3.1 Citations\n\nSubmission to key local and industry directories.', status: 'pending' },
                { id: 'local-3.2', code: '3.2', title: 'GMB Posts', content: '# 3.2 Content\n\nWeekly Google Business Profile updates/offers.', status: 'pending' },
                { id: 'local-3.3', code: '3.3', title: 'Reviews', content: '# 3.3 Reviews\n\nReview generation campaign setup.', status: 'pending' },
            ]
        },
        {
            id: 'local-p4',
            title: 'Evaluation Process',
            phaseNumber: 4,
            description: 'Tracking and reporting.',
            steps: [
                { id: 'local-4.1', code: '4.1', title: 'Rank Tracking', content: '# 4.1 Rankings\n\nGeo-grid rank tracking updates.', status: 'pending' },
                { id: 'local-4.2', code: '4.2', title: 'Reporting', content: '# 4.2 Reporting\n\nGMB Insights (Calls, Directions, Website clicks).', status: 'pending' },
                { id: 'local-4.3', code: '4.3', title: 'Expansion', content: '# 4.3 Expansion\n\nNew location opportunity analysis.', status: 'pending' },
            ]
        }
    ]
  }
];