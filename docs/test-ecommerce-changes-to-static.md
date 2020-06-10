How to manually test changes to eCommerce tracking in static
============================================================

Changes to static can have an impact to tracking across multiple frontend apps.
Whilst unit and feature tests exist, it might make sense to run some manual tests until we have stabalised the eCommerce code.

Apps using Ecommerce
--------------------
**Actual as of 2020-03-12**

- Search
  - Results
  - Ajax Ecommerce spelling suggestions
- Finders
- Brexit/Transition Checker results pages

**Proposed as of 2020-03-12**

- Mainstream browse
- Topic (specialist) browse
- Taxon pages
- Navigation header:
  - Whitehall version
  - Global (static) version

Manual testing Scripts
----------------------

### Search/Finder

**Go to a finder and do not search**
1) Go to a search/finder page without a search term
    - [ ] Check that ecommerce tracking is being passed with no search term
2) Click on a search result
    - [ ] Check that ecommerce tracking is being passed. Only navFinderClicked event tracking (current finder event tracking)
 
**Search from search and finder**
1) Enter a search term on page
    - [ ] Check that the dimensions are being passed with the results pageview 
2) Click on a result
    - [ ] Check that event click - UX is fired with all correct ecommerce dimensions
3) Go back
    - [ ] Check that the dimensions are being passed with the results pageview 
 
**Search from site (search/all only)**
1) Search from any page on site 
2) Land on search results - ensuring search results are sorted by relevant first
    - [ ] Check that the dimensions are being passed with the pageview
3) Click on a result
    - [ ] Check that event click - UX is fired with all correct ecommerce dimensions
4) Go back
    - [ ] Check that the dimensions are being passed with the pageview
5) Enter a search term on page
    - [ ] Check that the dimensions are being passed with the pageview
6) Click on a result
    - [ ] Check that event click - UX is fired with all correct ecommerce dimensions
 
**Using other sort options on search & finder**
1) Go to a finder
    - [ ] Check that ecommerce tracking is being passed with no search term
2) Enter a search term on page
    - [ ] Check that the dimensions are being passed with the pageview
3) Click on a result
    - [ ] Check that event click - UX is fired with all correct ecommerce dimensions
4) Sort by updated(newest)/most viewed
    - [ ] Check that ecommerce tracking is being passed
5) Click on a result
    - [ ] Check that ecommerce tracking is being passed with search term
 
**Using other refine options on search & finder**
1) Search with a search term
    - [ ] Check that the dimensions are being passed with the pageview
2) Search with another search term
    - [ ] Check that the dimensions are being passed with the pageview and that it is against the correct search term and the correct page url is shown in full
3) Click on a result
    - [ ] Check that correct dimensions are being passed and that it is against the correct search term (2nd refined search term)

### Search - Spelling
**Search from any page, then click a spelling suggestion**
1) Go to any non-search/finder page, and enter a misspelled search term in the search box, which takes you to the search results page
- **In the pageview (for UA-26179049-1):**
    - [ ] Custom dimension 81 is the spelling suggestion text
    - [ ] All other page custom dimensions included as usual
- **In the pageview:**
    - [ ] Impression list 'Search spelling suggestion' (containing 1 product)
    - [ ] Impression list product 1 dimension 71 is the actual misspelled search term
    - [ ] Impression list product 1 ID is dd395436-9b40-41f3-8157-740a453ac972
    - [ ] Also the main impression list 'Search' containing up to 20 products for the search results

2) Click on the spelling suggestion
- **In the event:**
    - [ ] Product 1 dimension 71 is the original misspelled search term
    - [ ] Product 1 ID is dd395436-9b40-41f3-8157-740a453ac972
    - [ ] Product Action List is 'Search spelling suggestions'
- **In the event:**
    - [ ] Custom dimension 81 is the suggested search term clicked
    - [ ] All other page custom dimensions included as usual
- **In the event:**
    - [ ] Impression list should NOT be visible here
- **In the new pageview:**
    - [ ] Page path parameter tbc contains the original mispelled keyword, while parameter 'keywords=' contains the new corrected keyword as usual
    - [ ] No spelling suggestion shown on the new results page.

- **In the new pageview:**
    - [ ] Impression list 'Search' as normal
    - [ ] No impression list 'Search spelling suggestions'

**Search from any page, then click a search result**
1) Go to any non-search/finder page, and enter a misspelled search term in the search box, which takes you to the search results page
- **In the pageview (for UA-26179049-1):**
    - [ ] Custom dimension 81 is the spelling suggestion text
    - [ ] All other page custom dimensions included as usual
- **In the pageview:**
    - [ ] Impression list 'Search spelling suggestion' (containing 1 product)
    - [ ] Impression list product 1 dimension 71 is the actual misspelled search term
    - [ ] Impression list product 1 ID is dd395436-9b40-41f3-8157-740a453ac972
    - [ ] Also the main impression list 'Search' containing up to 20 products for the search results

2) Click on any search result
- **In the event:**
    - [ ] Product Action List is 'Search'
    - [ ] Product ID and position match the result you clicked
    - [ ] Product dimension 71 is the original mispelled search term
- **In the event**
    - [ ] Impression list should NOT be visible here
		
		
**Search for a mispelled term that returns a suggestion but no results**
1) Enter a misspelled search term that has no results but does have a spelling suggestion
    **In the results pageview:
- [ ] Impression list 'Search spelling suggestion' appears, with product 1 as above
		In the results pageview:
- [ ] Custom dimension 5 has the value 0
		
**Search for a correctly spelled term**
1) Enter a common search term that is not misppelled and does not return a spelling suggestion
    **In the results pageview:**
- [ ] Impression list 'Search' appears as usual
- [ ] Impresson list 'Search spelling suggestions' does not appear
- [ ] Custom dimension 81 does not appear

### Brexit/Transition - Results

**A very long URL**
1) Visit [a very large set of results](https://www.gov.uk/transition-check/results?c%5B%5D=aero-space&c%5B%5D=automotive&c%5B%5D=electronic-machinery&c%5B%5D=install-service-repair&c%5B%5D=marine-transport&c%5B%5D=rail-manufacture&c%5B%5D=agriculture-farm&c%5B%5D=animal-ex-food&c%5B%5D=fish-inc-wholesale&c%5B%5D=forestry&c%5B%5D=vet&c%5B%5D=personal-service&c%5B%5D=legal-service&c%5B%5D=charity&c%5B%5D=voluntary&c%5B%5D=construction&c%5B%5D=environment&c%5B%5D=defence&c%5B%5D=electricity&c%5B%5D=nuclear&c%5B%5D=oil-gas-coal&c%5B%5D=renewables&c%5B%5D=media&c%5B%5D=creative&c%5B%5D=gamble&c%5B%5D=sports&c%5B%5D=culture&c%5B%5D=finance&c%5B%5D=insurance&c%5B%5D=real-estate&c%5B%5D=health&c%5B%5D=medical-tech&c%5B%5D=pharma&c%5B%5D=digital&c%5B%5D=telecoms&c%5B%5D=consumer-goods&c%5B%5D=chemical&c%5B%5D=diamond&c%5B%5D=metal&c%5B%5D=mining&c%5B%5D=non-metal-material&c%5B%5D=justice-including-prisons&c%5B%5D=public-administration&c%5B%5D=education&c%5B%5D=research&c%5B%5D=food-drink-tobacco&c%5B%5D=motor-trade&c%5B%5D=retail-wholesale-x-food-drink-motors&c%5B%5D=accommodation&c%5B%5D=restaurants-catering&c%5B%5D=tourism&c%5B%5D=air-passenger-freight&c%5B%5D=port-airports&c%5B%5D=postal-couriers&c%5B%5D=rail-passenger-freight&c%5B%5D=road-passenger-freight&c%5B%5D=warehouse-pipeline&c%5B%5D=import-from-eu&c%5B%5D=export-to-eu&c%5B%5D=provide-services-do-business-in-eu&c%5B%5D=haulage-goods-across-eu-borders&c%5B%5D=ip&c%5B%5D=ip-copyright&c%5B%5D=ip-trade-marks&c%5B%5D=ip-designs&c%5B%5D=ip-patents&c%5B%5D=ip-exhaustion-rights&c%5B%5D=sell-public-sector&c%5B%5D=sell-public-sector-contracts&c%5B%5D=sell-defence-contracts&c%5B%5D=eu-uk-funding&c%5B%5D=personal-eu-org&c%5B%5D=personal-eu-org-process&c%5B%5D=personal-eu-org-use&c%5B%5D=personal-eu-org-provide&c%5B%5D=employ-eu-citizens&c%5B%5D=owns-operates-business-organisation&c%5B%5D=visiting-driving&c%5B%5D=visiting-bring-pet&c%5B%5D=visiting-ie&c%5B%5D=visiting-eu&c%5B%5D=visiting-row&c%5B%5D=travel-eu-business&c%5B%5D=working-uk&c%5B%5D=working-ie&c%5B%5D=working-eu&c%5B%5D=studying-uk&c%5B%5D=studying-ie&c%5B%5D=studying-eu&c%5B%5D=retired&c%5B%5D=living-uk&c%5B%5D=nationality-uk)
  - Check that the dimensions are being passed to a page view
    - [ ] Each action is listed as a product
    - [ ] Each action is grouped by the subheading
    - [ ] Each action has an index appropriate to its group
2) Click on a guidance URL
  - [ ] Check that the dimensions are being passed to a click event
3) Click on a title URL
  - [ ] Check that the dimensions are being passed to a click event

**A URL with just one choice**
1) Visit [a small large set of results](https://www.gov.uk/transition-check/results?c[]=travel-eu-business&c[]=working-uk&c[]=working-ie&c[]=living-uk&c[]=nationality-uk)
  - Check that the dimensions are being passed to a page view
    - [ ] Each action is listed as a product
    - [ ] Each action is grouped by the subheading
    - [ ] Each action has an index appropriate to its group2) Click on a guidance URL
  - [ ] Check that the dimensions are being passed to a click event
3) Click on a title URL
  - [ ] Check that the dimensions are being passed to a click event


**A no questions answered page**
1) Visit [A results page with no questions](https://www.gov.uk/transition-check/results)

**A results page with no actions**
1) Visit [A results page with no actions](https://www.gov.uk/transition-check/results?c[]=nationality-uk)

References
----------
- [Harriet's checklist for Ecommerce finder/search checks](https://docs.google.com/spreadsheets/d/1BFkhVA0z3XgdgtZBJ5DQ7B7zHhPafohfT-9h9xpTWbw/efdit#gid=0)
- [Tara's checklist for Ecommerce search checks](https://docs.google.com/spreadsheets/d/1ZurYvYs2PLrlqOU4S0TrkbeIB8VjUG8L6ixUTp11SpY/edit#gid=0])
