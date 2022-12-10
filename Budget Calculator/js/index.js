//tax calculator code:

const calculateBtn = document.querySelector(".calculate-tax-button");
const preTaxSalary = document.querySelector(".pre-tax-salary"); 
const state = document.getElementById("states"); 
const filingStatus = document.getElementById("filing-status"); 


count = 0;

calculateBtn.addEventListener("click", function(){  

   const tips = document.getElementById("tipsHeader");
   tips.style.display = 'block';

   if(count > 0){
      window.location.reload();
   }
   count++;

   selectedFilingStatus = filingStatus.options[filingStatus.selectedIndex].text; 

   //federal income tax calculation
   //source: https://www.forbes.com/sites/markkantrowitz/2021/11/10/new-2022-irs-income-tax-brackets-and-phaseouts/?sh=1829dad27b04
   amount = preTaxSalary.value;
   
   fedTax = 0; 
   socialSecurityTax = 0;
   medicareTax = 0; 

   
   if(selectedFilingStatus == "Single"){
      if(amount > 12950){
            postDeductionAmount = amount - 12950;
         } 

      if(postDeductionAmount <= 10275){
         fedTax = .10 * postDeductionAmount;
      } else if(postDeductionAmount >= 10276 && postDeductionAmount <= 41775){ 
         fedTax = 1027.5 + (.12 * (postDeductionAmount - 10275));
      } else if(postDeductionAmount >= 41776 && postDeductionAmount <= 89075){ 
         fedTax = 4807.5 + (.22 * (postDeductionAmount - 41775));
      } else if(postDeductionAmount >= 89076 && amount <= 170050){ 
         fedTax = 15213.5 + (.24 * (postDeductionAmount - 89075));
      } else if(postDeductionAmount >= 170051 && amount <= 215950){ 
         fedTax = 34647.5 + (.32 * (postDeductionAmount - 17050));
      } else if(postDeductionAmount >= 215951 && amount <= 539900){ 
         fedTax = 49335.5 + (.35 * (postDeductionAmount - 215950));
      } else if(postDeductionAmount >= 539901){ 
         fedTax = 162718 + (.37 * (postDeductionAmount - 539901));
      }
   } 

   if(selectedFilingStatus == "Married"){
      if(amount > 25900){
            postDeductionAmount = amount - 25900;
         }

      if(postDeductionAmount <= 20550){
         fedTax = .10 * postDeductionAmount;
      } else if(postDeductionAmount >= 20551 && postDeductionAmount <= 83550){ 
         fedTax = 2055 + (.12 * (postDeductionAmount - 20551));
      } else if(postDeductionAmount >= 83551 && postDeductionAmount <= 178150){ 
         fedTax = 9615 + (.22 * (postDeductionAmount - 83551));
      } else if(postDeductionAmount >= 178151 && amount <= 340100){ 
         fedTax = 30427 + (.24 * (postDeductionAmount - 178151));
      } else if(postDeductionAmount >= 340101 && amount <= 431900){ 
         fedTax = 69295 + (.32 * (postDeductionAmount - 341101));
      } else if(postDeductionAmount >= 431901 && amount <= 647850){ 
         fedTax = 98671 + (.35 * (postDeductionAmount - 431901));
      } else if(postDeductionAmount >= 647851){ 
         fedTax = 174253.50 + (.37 * (postDeductionAmount - 647851));
      }
   }  

   postFedIncTaxSalary = amount - fedTax;

   if(amount <= 147000){
       socialSecurityTax = .062 * amount;
   }

   if(amount <= 200000){
       medicareTax = .0145 * amount;
   } else if(amount > 200000){
       medicareTax = (.0145 + .09) * amount;
   }

   fedTax = fedTax + socialSecurityTax + medicareTax;

   postFedTaxSalary = postFedIncTaxSalary - medicareTax - socialSecurityTax;


   //state income tax calculation
   SelectedState = state.options[state.selectedIndex].text; 
   
   stateIncomeTax = 0;
   
   if(SelectedState == "Alabama"){
      //source: https://www.revenue.alabama.gov/faqs/what-is-alabamas-individual-income-tax-rate/ 
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 500){
            stateIncomeTax = .02 * 500;
         } else if(postFedTaxSalary > 500 && postFedTaxSalary <= 3000){ 
            stateIncomeTax = 10 + (.04 * (postFedTaxSalary - 500));
         } else if(postFedTaxSalary > 3000){ 
            stateIncomeTax = 10 + 110 + (.05 * (postFedTaxSalary - 3000));
         }
      } else if(selectedFilingStatus == "Married"){
         if(postFedTaxSalary <= 1000){
            stateIncomeTax = .02 * 1000;
         } else if(postFedTaxSalary > 1000 && postFedTaxSalary <= 6000){ 
            stateIncomeTax = 20 + (.04 * (postFedTaxSalary - 6000));
         } else if(postFedTaxSalary > 6000){ 
            stateIncomeTax = 10 + 110 + (.05 * (postFedTaxSalary - 6000));
         }
      }
   }
   
   
   if(SelectedState == "Alaska"){
      
      if(selectedFilingStatus == "Single" || selectedFilingStatus == "Married"){
         stateIncomeTax = 0;
      } 
   }

  
   
   if(SelectedState == "Arizona"){
      source: https://azdor.gov/forms/individual/form-140-x-y-tables 
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary < 28653){
            stateIncomeTax = .0255 * 28653;
         } else if(postFedTaxSalary >= 28653){ 
            stateIncomeTax = 731 + (.0298 * (postFedTaxSalary - 28653));
         }
      } else if(selectedFilingStatus == "Married"){
         if(postFedTaxSalary < 57305){
            stateIncomeTax = .0255 * 57305;
         } else if(postFedTaxSalary >= 57305){ 
            stateIncomeTax = 1461 + (.0298 * (postFedTaxSalary - 57305));
         }
      }
   }

   
   if(SelectedState == "Arkansas"){
      source: https://www.arkansasedc.com/why-arkansas/business-climate/tax-structure/personal-income-tax
      if(postFedTaxSalary <= 84500){
         if(postFedTaxSalary < 5000){
            stateIncomeTax = 0;
         } else if(postFedTaxSalary >= 5000 && postFedTaxSalary < 10000){ 
            stateIncomeTax = .02 * (postFedTaxSalary - 5000);
         } else if(postFedTaxSalary >= 10000 && postFedTaxSalary < 14300){ 
            stateIncomeTax = 100+ (.03 * (postFedTaxSalary - 10000));
         } else if(postFedTaxSalary >= 14300 && postFedTaxSalary < 23599){ 
            stateIncomeTax = 100 + 429 + (.034 * (postFedTaxSalary - 14300));
         } else if(postFedTaxSalary >= 23600 && postFedTaxSalary <= 84500){ 
            stateIncomeTax = 100 + 429 + 802.4 + (.049 * (postFedTaxSalary - 23600));
         }
      } else if(postFedTaxSalary > 84500) {
         if(postFedTaxSalary <= 4300){
            stateIncomeTax = .02 * postFedTaxSalary;
         } else if(postFedTaxSalary > 4300 && postFedTaxSalary <= 8500){ 
            stateIncomeTax = 86 + (.04 * (postFedTaxSalary - 8500));
         } else if(postFedTaxSalary > 8500){ 
            stateIncomeTax = 86 + 168 + (.049 * (postFedTaxSalary - 8500));
         }
      }
   }

   
    
  
   if(SelectedState == "California"){
      //source: https://www.nerdwallet.com/article/taxes/federal-income-tax-brackets
      if(selectedFilingStatus == "Single"){
            if(postFedTaxSalary < 9325){
               stateIncomeTax = .01 * postFedTaxSalary;
            } else if(postFedTaxSalary >= 9326 && postFedTaxSalary < 22108){ 
               stateIncomeTax = 93.25 + .02 * (postFedTaxSalary - 9325);
            } else if(postFedTaxSalary >= 22108 && postFedTaxSalary < 34893){ 
               stateIncomeTax = 348.89 + (.04 * (postFedTaxSalary - 22107));
            } else if(postFedTaxSalary >= 34893 && postFedTaxSalary <= 48435){ 
               stateIncomeTax = 860.29 + (.06 * (postFedTaxSalary - 34892));
            } else if(postFedTaxSalary >= 48436 && postFedTaxSalary <= 61214){ 
               stateIncomeTax = 1672.87 + (.08 * (postFedTaxSalary - 48435));
            } else if(postFedTaxSalary >= 61215 && postFedTaxSalary <= 312686){ 
               stateIncomeTax = 2695.19 + (.093 * (postFedTaxSalary - 61214));
            } else if(postFedTaxSalary >= 312687 && postFedTaxSalary <= 375221.){ 
               stateIncomeTax = 26082.09 + (.103 * (postFedTaxSalary - 61214));
            } else if(postFedTaxSalary >= 375222 && postFedTaxSalary <= 625369){ 
               stateIncomeTax = 32523.20  + (.113 * (postFedTaxSalary - 375221));
            } else if(postFedTaxSalary >= 625370){ 
               stateIncomeTax = 60789.92  + (.123 * (postFedTaxSalary - 625369));
            }
         } else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary < 18650){
               stateIncomeTax = .01 * postFedTaxSalary;
            } else if(postFedTaxSalary >= 18651 && postFedTaxSalary < 44214){ 
               stateIncomeTax = 186.50 + (.02 * (postFedTaxSalary - 18650));
            } else if(postFedTaxSalary >= 44215 && postFedTaxSalary < 69784){ 
               stateIncomeTax = 697.78 + (.04 * (postFedTaxSalary - 44214));
            } else if(postFedTaxSalary >= 69785 && postFedTaxSalary <= 96870){ 
               stateIncomeTax = 1720.58 + (.06 * (postFedTaxSalary - 69784));
            } else if(postFedTaxSalary >= 96871 && postFedTaxSalary <= 122428){ 
               stateIncomeTax = 3345.74 + (.08 * (postFedTaxSalary - 96870));
            } else if(postFedTaxSalary >= 122429 && postFedTaxSalary <= 625372){ 
               stateIncomeTax = 5390.38  + (.093 * (postFedTaxSalary - 122428));
            } else if(postFedTaxSalary >= 625373 && postFedTaxSalary <= 750442){ 
               stateIncomeTax = 52164.17 + (.103 * (postFedTaxSalary - 625372));
            } else if(postFedTaxSalary >= 750443 && postFedTaxSalary <= 1250738){ 
               stateIncomeTax = 65046.38  + (.113 * (postFedTaxSalary - 750442));
            } else if(postFedTaxSalary >= 1250739){ 
               stateIncomeTax = 121579.83  + (.123 * (postFedTaxSalary - 1250738));
            }
         }  
      }
   
  

   
   if(SelectedState == "Colorado"){
      //source: https://tax.colorado.gov/individual-income-tax-FAQ
      stateIncomeTax = postFedTaxSalary * .0440;
   }

   
   if(SelectedState == "Connecticut"){
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 10000){
            stateIncomeTax = .03 * postFedTaxSalary;
         } else if(postFedTaxSalary > 10000 && postFedTaxSalary <= 50000){ 
            stateIncomeTax = 300 + (.05 * (postFedTaxSalary - 10000));
         } else if(postFedTaxSalary > 50000 && postFedTaxSalary <= 100000){ 
            stateIncomeTax = 2300 + (.055 * (postFedTaxSalary - 50000));
         } else if(postFedTaxSalary > 100000 && postFedTaxSalary <= 200000){ 
            stateIncomeTax = 5050 + (.06 * (postFedTaxSalary - 100000));
         } else if(postFedTaxSalary > 200000 && postFedTaxSalary <= 250000){ 
            stateIncomeTax = 11050 + (.065 * (postFedTaxSalary - 200000));
         } else if(postFedTaxSalary > 250000 && postFedTaxSalary <= 500000){ 
            stateIncomeTax = 14300 + (.068 * (postFedTaxSalary - 250000));
         } else if(postFedTaxSalary > 500000){ 
            stateIncomeTax = 31550 + (.0699 * (postFedTaxSalary - 500000));
         } 
      }  else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 20000){
               stateIncomeTax = .03 * postFedTaxSalary;
            } else if(postFedTaxSalary > 20000 && postFedTaxSalary <= 100000){ 
               stateIncomeTax = 600 + (.05 * (postFedTaxSalary - 20000));
            } else if(postFedTaxSalary > 10000 && postFedTaxSalary <= 200000){ 
               stateIncomeTax = 4600 + (.055 * (postFedTaxSalary - 100000));
            } else if(postFedTaxSalary > 200000 && postFedTaxSalary <= 400000){ 
               stateIncomeTax = 10100 + (.06 * (postFedTaxSalary - 200000));
            } else if(postFedTaxSalary > 400000 && postFedTaxSalary <= 500000){ 
               stateIncomeTax = 22100 + (.065 * (postFedTaxSalary - 400000));
            } else if(postFedTaxSalary > 500000 && postFedTaxSalary <= 1000000){ 
               stateIncomeTax = 28600 + (.068 * (postFedTaxSalary - 500000));
            } else if(postFedTaxSalary > 1000000){ 
               stateIncomeTax = 63100 + (.0699 * (postFedTaxSalary - 1000000));
          }
      }
   }
         
   

   
   if(SelectedState == "Delaware"){
      //source: https://www.bankrate.com/taxes/delaware-state-taxes/
      if(selectedFilingStatus == "Single" || selectedFilingStatus == "Married"){
         if(postFedTaxSalary <= 2000){
            stateIncomeTax = 0;
         } else if(postFedTaxSalary > 2000 && postFedTaxSalary <= 5000){ 
            stateIncomeTax = (.022 * (postFedTaxSalary - 2000));
         } else if(postFedTaxSalary > 5000 && postFedTaxSalary <= 10000){ 
            stateIncomeTax = 66 + (.039 * (postFedTaxSalary - 10000));
         } else if(postFedTaxSalary > 10000 && postFedTaxSalary <= 20000){ 
            stateIncomeTax = 66 + 195 + (.048 * (postFedTaxSalary - 100000));
         } else if(postFedTaxSalary > 20000 && postFedTaxSalary <= 25000){ 
            stateIncomeTax = 66 + 195 + 480 + (.052 * (postFedTaxSalary - 20000));
         } else if(postFedTaxSalary > 25000 && postFedTaxSalary <= 60000){ 
            stateIncomeTax = 66 + 195 + 480 + 260 + (.055 * (postFedTaxSalary - 25000));
         } else if(postFedTaxSalary > 60000){ 
            stateIncomeTax = 66 + 195 + 480 + 260 + 1925 + (.066 * (postFedTaxSalary - 60000));
         } 
      }  
   }

   if(SelectedState == "Florida"){
      stateIncomeTax = 0;
   }

   
   if(SelectedState == "Georgia"){
    
      //source: https://www.bankrate.com/taxes/georgia-state-taxes/
      if(selectedFilingStatus == "Single"){
         ;
         if(postFedTaxSalary <= 750){
            stateIncomeTax = 0.01 * postFedTaxSalary;
         } else if(postFedTaxSalary > 750 && postFedTaxSalary <= 2250){ 
            stateIncomeTax = 7.5 + (.02 * (postFedTaxSalary - 750));
         } else if(postFedTaxSalary > 2250 && postFedTaxSalary <= 3750){ 
            stateIncomeTax = 7.5 + 29.98 + (.03 * (postFedTaxSalary - 2250));
         } else if(postFedTaxSalary > 3750 && postFedTaxSalary <= 5250){ 
            stateIncomeTax = 7.5 + 29.98 + 45 + (.03 * (postFedTaxSalary - 3750));
         } else if(postFedTaxSalary > 5250 && postFedTaxSalary <= 7000){ 
            stateIncomeTax = 7.5 + 29.98 + 45 + 45 + (.04 * (postFedTaxSalary - 5250));
         } else if(postFedTaxSalary > 7000){ 
            stateIncomeTax = 7.5 + 29.98 + 45 + 45 + 87.45 + (.04 * (postFedTaxSalary - 5250));
         } 
      } else if(selectedFilingStatus == "Married"){
         
            if(postFedTaxSalary <= 1000){
               stateIncomeTax = 0.01 * postFedTaxSalary;
            } else if(postFedTaxSalary > 1000 && postFedTaxSalary <= 3000){ 
               stateIncomeTax = 10 + (.02 * (postFedTaxSalary - 1000));
            } else if(postFedTaxSalary > 3000 && postFedTaxSalary <= 5000){ 
               stateIncomeTax = 10 + 40 + (.03 * (postFedTaxSalary - 3000));
            } else if(postFedTaxSalary > 5000 && postFedTaxSalary <= 7000){ 
               stateIncomeTax = 10 + 40 + 50 + (.04 * (postFedTaxSalary - 5000));
            } else if(postFedTaxSalary > 7000 && postFedTaxSalary <= 10000){ 
               stateIncomeTax = 10 + 40 + 50 + 80 + (.05 * (postFedTaxSalary - 7000));
            } else if(postFedTaxSalary > 10000){ 
               stateIncomeTax = 10 + 40 + 50 + 80 + 150 + (.0575 * (postFedTaxSalary - 10000));
            }
         }
      }
   
   
   if(SelectedState == "Hawaii"){
      //source: https://tax.hawaii.gov/forms/d_18table-on/
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 2400){
            stateIncomeTax = 0.014 * postFedTaxSalary;
         } else if(postFedTaxSalary > 2400 && postFedTaxSalary <= 4800){ 
            stateIncomeTax = 34 + (.032 * (postFedTaxSalary - 2400));
         } else if(postFedTaxSalary > 4800 && postFedTaxSalary <= 9600){ 
            stateIncomeTax = 110 + (.0550 * (postFedTaxSalary - 4800));
         } else if(postFedTaxSalary > 9600 && postFedTaxSalary <= 14400){ 
            stateIncomeTax = 374 + (.0640 * (postFedTaxSalary - 9600));
         } else if(postFedTaxSalary > 14400 && postFedTaxSalary <= 19200){ 
            stateIncomeTax = 682 + (.0680 * (postFedTaxSalary - 14400));
         } else if(postFedTaxSalary > 19200 && postFedTaxSalary <= 24000){ 
            stateIncomeTax = 1008 + (.0720 * (postFedTaxSalary - 5250));
         } else if(postFedTaxSalary > 24000 && postFedTaxSalary <= 36000){ 
            stateIncomeTax = 1354 + (.0760 * (postFedTaxSalary - 19200));
         } else if(postFedTaxSalary > 36000 && postFedTaxSalary <= 48000){ 
            stateIncomeTax = 2266 + (.0790 * (postFedTaxSalary - 36000));
         } else if(postFedTaxSalary > 48000 && postFedTaxSalary <= 150000){ 
            stateIncomeTax = 3214 + (.0825 * (postFedTaxSalary - 48000));
         } else if(postFedTaxSalary > 150000 && postFedTaxSalary <= 175000){ 
            stateIncomeTax = 11629 + (.09 * (postFedTaxSalary - 150000));
         }  else if(postFedTaxSalary > 175000 && postFedTaxSalary <= 200000){ 
            stateIncomeTax = 13879 + (.10 * (postFedTaxSalary - 175000));
         }  else if(postFedTaxSalary > 200000){ 
            stateIncomeTax = 16379 + (.11 * (postFedTaxSalary - 200000));
         }  
      } else if(selectedFilingStatus == "Married"){
               if(postFedTaxSalary <= 4800){
                  stateIncomeTax = 0.014 * postFedTaxSalary;
               } else if(postFedTaxSalary > 4800 && postFedTaxSalary <= 9600){ 
                  stateIncomeTax = 67 + (.032 * (postFedTaxSalary - 4800));
               } else if(postFedTaxSalary > 9600 && postFedTaxSalary <= 19200){ 
                  stateIncomeTax = 221 + (.0550 * (postFedTaxSalary - 9600));
               } else if(postFedTaxSalary > 19200 && postFedTaxSalary <= 28800){ 
                  stateIncomeTax = 749 + (.0640 * (postFedTaxSalary - 19200));
               } else if(postFedTaxSalary > 28800 && postFedTaxSalary <= 38400){ 
                  stateIncomeTax = 1363 + (.0680 * (postFedTaxSalary - 38800));
               } else if(postFedTaxSalary > 38400 && postFedTaxSalary <= 48000){ 
                  stateIncomeTax = 2016 + (.0720 * (postFedTaxSalary - 38400));
               } else if(postFedTaxSalary > 48000 && postFedTaxSalary <= 72000){ 
                  stateIncomeTax = 2707 + (.0760 * (postFedTaxSalary - 48000));
               } else if(postFedTaxSalary > 72000 && postFedTaxSalary <= 96000){ 
                  stateIncomeTax = 4531 + (.0790 * (postFedTaxSalary - 72000));
               } else if(postFedTaxSalary > 96000 && postFedTaxSalary <= 30000){ 
                  stateIncomeTax = 6427 + (.0825 * (postFedTaxSalary - 96000));
               } else if(postFedTaxSalary > 300000 && postFedTaxSalary <= 350000){ 
                  stateIncomeTax = 23257 + (.09 * (postFedTaxSalary - 300000));
               }  else if(postFedTaxSalary > 350000 && postFedTaxSalary <= 400000){ 
                  stateIncomeTax = 27757 + (.10 * (postFedTaxSalary - 350000));
               }  else if(postFedTaxSalary > 400000){ 
                  stateIncomeTax = 32757 + (.11 * (postFedTaxSalary - 400000));
               }
            }
      
   }

   if(SelectedState == "Idaho"){
      //source: https://tax.idaho.gov/i-1110.cfm
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 1588){
            stateIncomeTax = 0;
         } else if(postFedTaxSalary > 1588 && postFedTaxSalary <= 4763){ 
            stateIncomeTax = 15.88 + (.031 * (postFedTaxSalary - 1588));
         } else if(postFedTaxSalary > 4763 && postFedTaxSalary <= 6351){ 
            stateIncomeTax = 114.32 + (.045 * (postFedTaxSalary - 4763));
         } else if(postFedTaxSalary > 6351 && postFedTaxSalary <= 7939){ 
            stateIncomeTax = 185.77 + (.055 * (postFedTaxSalary - 6351));
         } else if(postFedTaxSalary > 7939){ 
            stateIncomeTax = 273.10 + (.0650 * (postFedTaxSalary - 7939));
         } 
      } else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 3176){
               stateIncomeTax = 0;
            } else if(postFedTaxSalary > 3176 && postFedTaxSalary <= 9526){ 
               stateIncomeTax = 31.67 + (.031 * (postFedTaxSalary - 3175));
            } else if(postFedTaxSalary > 9526 && postFedTaxSalary <= 12702){ 
               stateIncomeTax = 228.64 + (.045 * (postFedTaxSalary - 4763));
            } else if(postFedTaxSalary > 12702 && postFedTaxSalary <= 15878){ 
               stateIncomeTax = 371.54 + (.055 * (postFedTaxSalary - 6351));
            } else if(postFedTaxSalary > 15878){ 
               stateIncomeTax = 546.20 + (.0650 * (postFedTaxSalary - 15878));
            }
         }
      
   }
   
   if(SelectedState == "Illinois"){
      //source:https://www2.illinois.gov/rev/research/taxrates/Pages/income.aspx
      stateIncomeTax = amount * .0495;
   }
   
   
   if(SelectedState == "Indiana"){
      //source: https://www.in.gov/dor/business-tax/tax-rates-fees-and-penalties/
      stateIncomeTax = amount * .0323;
   }
   
   
   if(SelectedState == "Iowa"){
      //source: https://tax.iowa.gov/idr-announces-2023-interest-rates-deductions-income-tax-brackets
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 6000){
            stateIncomeTax = 0;
         } else if(postFedTaxSalary > 6000 && postFedTaxSalary <= 30000){ 
            stateIncomeTax = 264 + (.0482 * (postFedTaxSalary - 60000));
         } else if(postFedTaxSalary > 30000 && postFedTaxSalary <= 75000){ 
            stateIncomeTax = 1420.80 + (.057 * (postFedTaxSalary - 30000));
         } else if(postFedTaxSalary > 75000){ 
            stateIncomeTax = 3985.80 + (.060 * (postFedTaxSalary - 75000));
         }
      } else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 12000){
               stateIncomeTax = 0;
            } else if(postFedTaxSalary > 12000 && postFedTaxSalary <= 60000){ 
               stateIncomeTax = 528 + (.0482 * (postFedTaxSalary - 12000));
            } else if(postFedTaxSalary > 60000 && postFedTaxSalary <= 150000){ 
               stateIncomeTax = 2841.60 + (.057 * (postFedTaxSalary - 60000));
            } else if(postFedTaxSalary > 150000){ 
               stateIncomeTax = 7971.60 + (.060 * (postFedTaxSalary - 150000));
         }
      }
   }
   
   
   
   if(SelectedState == "Kansas"){
      //source https://www.ksrevenue.gov/taxrates.html
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 15000){
            stateIncomeTax = 0.031 * postFedTaxSalary;
         } else if(postFedTaxSalary > 15000 && postFedTaxSalary <= 30000){ 
            stateIncomeTax = 465 + (.0525 * (postFedTaxSalary - 15000));
         } else if(postFedTaxSalary > 30000){ 
            stateIncomeTax = 2505 + (.057 * (postFedTaxSalary - 30000));
         }
      } else if(selectedFilingStatus == "Married"){
         if(postFedTaxSalary <= 30000){
            stateIncomeTax = 0.031 * postFedTaxSalary;
         } else if(postFedTaxSalary > 30000 && postFedTaxSalary <= 60000){ 
            stateIncomeTax = 930 + (.0525 * (postFedTaxSalary - 30000));
         } else if(postFedTaxSalary > 60000){ 
            stateIncomeTax = 1252.50 + (.057 * (postFedTaxSalary - 60000));
         }
      }
   }
   
   
   if(SelectedState == "Kentucky"){
      //source: https://revenue.ky.gov/Individual/Individual-Income-Tax/Pages/default.aspx
      stateIncomeTax = amount * .05;
   }

   
   if(SelectedState == "Louisiana"){
      //source: https://revenue.louisiana.gov/IndividualIncomeTax
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 12500){
            stateIncomeTax = 0.0185 * postFedTaxSalary;
         } else if(postFedTaxSalary > 12500 && postFedTaxSalary <= 50000){ 
            stateIncomeTax = 231.25 + (.0350 * (postFedTaxSalary - 12500));
         } else if(postFedTaxSalary > 50000){ 
            stateIncomeTax = 231.25 + 1312.5 + (.0425 * (postFedTaxSalary - 50000));
         }
      } else if(selectedFilingStatus == "Married"){
         if(postFedTaxSalary <= 25000){
            stateIncomeTax = 0.0185 * postFedTaxSalary;
         } else if(postFedTaxSalary > 25000 && postFedTaxSalary <= 100000){
            stateIncomeTax = 462.5 + (.0350 * (postFedTaxSalary - 30000));
         } else if(postFedTaxSalary > 100000){ 
            stateIncomeTax = 462.5 + 2625 + (.0325 * (postFedTaxSalary - 100000));
         }
      }
   }
   
   
   if(SelectedState == "Maine"){ 
      //source: https://www.maine.gov/revenue/tax-return-forms/individual-income-tax-2022
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 23000){
            stateIncomeTax = 0.058 * postFedTaxSalary;
         } else if(postFedTaxSalary > 23000 && postFedTaxSalary <= 54450){ 
            stateIncomeTax = 1334 + (.0675 * (postFedTaxSalary - 23000));
         } else if(postFedTaxSalary > 54450){ 
            stateIncomeTax = 3457 + (.0715 * (postFedTaxSalary - 54450));
         }
      } else if(selectedFilingStatus == "Married"){
         if(postFedTaxSalary <= 46000){
            stateIncomeTax = 0.058 * postFedTaxSalary;
         } else if(postFedTaxSalary > 46000 && postFedTaxSalary <= 108900){
            stateIncomeTax = 2668 + (.0675 * (postFedTaxSalary - 46000));
         } else if(postFedTaxSalary > 108900){ 
            stateIncomeTax = 6914 + (.0715 * (postFedTaxSalary - 108900));
         }
      }
   }
   
   
   if(SelectedState == "Maryland"){
      //source: https://www.marylandtaxes.gov/individual/income/tax-info/tax-rates.php
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 1000){
            stateIncomeTax = 0.02 * postFedTaxSalary;
         } else if(postFedTaxSalary > 1000 && postFedTaxSalary <= 2000){ 
            stateIncomeTax = 20 + (.03 * (postFedTaxSalary - 1000));
         } else if(postFedTaxSalary > 2000 && postFedTaxSalary <= 3000){ 
            stateIncomeTax = 50 + (.04 * (postFedTaxSalary - 2000));
         } else if(postFedTaxSalary > 3000 && postFedTaxSalary <= 100000){ 
            stateIncomeTax = 90 + (.0475 * (postFedTaxSalary - 3000));
         } else if(postFedTaxSalary > 100000 && postFedTaxSalary <= 125000){ 
            stateIncomeTax = 4697.50 + (.05 * (postFedTaxSalary - 100000));
         } else if(postFedTaxSalary > 125000 && postFedTaxSalary <= 150000){ 
            stateIncomeTax = 5946.50 + (.0525 * (postFedTaxSalary - 125000));
         } else if(postFedTaxSalary > 150000 && postFedTaxSalary <= 250000){ 
            stateIncomeTax = 7260 + (.055 * (postFedTaxSalary - 150000));
         } else if(postFedTaxSalary > 250000){ 
            stateIncomeTax = 12760 + (.0575 * (postFedTaxSalary - 300000));
         } else if(selectedFilingStatus == "Single"){
            if(postFedTaxSalary <= 1000){
               stateIncomeTax = 0.02 * postFedTaxSalary;
            } else if(postFedTaxSalary > 1000 && postFedTaxSalary <= 2000){ 
               stateIncomeTax = 20 + (.03 * (postFedTaxSalary - 1000));
            } else if(postFedTaxSalary > 2000 && postFedTaxSalary <= 3000){ 
               stateIncomeTax = 50 + (.04 * (postFedTaxSalary - 2000));
            } else if(postFedTaxSalary > 3000 && postFedTaxSalary <= 150000){ 
               stateIncomeTax = 90 + (.0475 * (postFedTaxSalary - 3000));
            } else if(postFedTaxSalary > 150000 && postFedTaxSalary <= 175000){ 
               stateIncomeTax = 7072.5 + (.05 * (postFedTaxSalary - 150000));
            } else if(postFedTaxSalary > 175000 && postFedTaxSalary <= 2250000){ 
               stateIncomeTax = 8322.5 + (.0525 * (postFedTaxSalary - 175000));
            } else if(postFedTaxSalary > 225000 && postFedTaxSalary <= 300000){ 
               stateIncomeTax = 10947.5 + (.055 * (postFedTaxSalary - 225000));
            } else if(postFedTaxSalary > 300000){ 
               stateIncomeTax = 15072.50 + (.0575 * (postFedTaxSalary - 300000));
            } 
         }
      }
   }
   
   
   if(SelectedState == "Massachusetts"){
      //source: https://www.mass.gov/guides/personal-income-tax-for-residents
      stateIncomeTax = amount * .05;
   }
   
   if(SelectedState == "Michigan"){
      //source: https://www.michigan.gov/taxes/questions/iit/accordion/filing/what-are-the-current-tax-rate-and-exemption-amounts-1
      stateIncomeTax = amount * .0425;
   }
   
   
   if(SelectedState == "Minnesota"){
      //source: https://www.revenue.state.mn.us/minnesota-income-tax-rates-and-brackets
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 28080){
            stateIncomeTax = .0535 * postFedTaxSalary;
         } else if(postFedTaxSalary > 28080 && postFedTaxSalary <= 92230){ 
            stateIncomeTax = 1502.28 + (.0680 * (postFedTaxSalary - 28080));
         } else if(postFedTaxSalary > 92230 && postFedTaxSalary <= 171220){ 
            stateIncomeTax = 1502.28 + 4362.2 + (.0785 * (postFedTaxSalary - 92230));
         } else if(postFedTaxSalary > 171220){ 
            stateIncomeTax = 1502.28 + 4362.2 + 6200.715 + (.0985 * (postFedTaxSalary - 171220));
         }
      } else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 41050){
               stateIncomeTax = .0535 * postFedTaxSalary;
            } else if(postFedTaxSalary > 41050 && postFedTaxSalary <= 163060){ 
               stateIncomeTax = 2196.175 + (.0680 * (postFedTaxSalary - 41050));
            } else if(postFedTaxSalary > 60000 && postFedTaxSalary <= 284810){ 
               stateIncomeTax = 2196.175 + 8296.68 + (.0785 * (postFedTaxSalary - 60000));
            } else if(postFedTaxSalary > 284810){ 
               stateIncomeTax = 2196.175 + 8296.68 + 9557.375 + (.0680 * (postFedTaxSalary - 284810));
         }
      }
   }
   
  
   if(SelectedState == "Mississippi"){
      //source: https://www.dor.ms.gov/individual/tax-rates
      if(postFedTaxSalary <= 4000){
         stateIncomeTax =  0;
      } else if(postFedTaxSalary > 4000 && postFedTaxSalary <= 5000){ 
         stateIncomeTax = .03 * postFedTaxSalary;
      } else if(postFedTaxSalary > 5000 && postFedTaxSalary <= 10000){ 
         stateIncomeTax = 30 + (.04 * (postFedTaxSalary - 5000));
      } else if(postFedTaxSalary > 10000){ 
         stateIncomeTax = 30 + 200 + (.05 * (postFedTaxSalary - 10000));
      }
   } 
   
   
   if(SelectedState == "Missouri"){
      //source: https://dor.mo.gov/taxation/individual/tax-types/income/year-changes/
      if(postFedTaxSalary <= 111){
         stateIncomeTax = 0;
      } else if(postFedTaxSalary > 112 && postFedTaxSalary <= 1121){ 
         stateIncomeTax = .015 * (postFedTaxSalary - 112);
      } else if(postFedTaxSalary > 1121 && postFedTaxSalary <= 2242){ 
         stateIncomeTax = 17 + (.02 * (postFedTaxSalary - 1121));
      } else if(postFedTaxSalary > 2242 && postFedTaxSalary <= 3363){ 
         stateIncomeTax = 39 + (.025 * (postFedTaxSalary - 2242));
      } else if(postFedTaxSalary > 3363 && postFedTaxSalary <= 4484){ 
         stateIncomeTax = 67 + (.03 * (postFedTaxSalary - 4484));
      } else if(postFedTaxSalary > 4484 && postFedTaxSalary <= 5605){ 
         stateIncomeTax = 101 + (.045 * (postFedTaxSalary - 4484));
      } else if(postFedTaxSalary > 5605 && postFedTaxSalary <= 6726){ 
         stateIncomeTax = 140 + (.04 * (postFedTaxSalary - 5605));
      } else if(postFedTaxSalary > 6726 && postFedTaxSalary <= 7847){ 
         stateIncomeTax = 185 + (.045 * (postFedTaxSalary - 6726));
      } else if(postFedTaxSalary > 7847 && postFedTaxSalary <= 8968){ 
         stateIncomeTax = 235 + (.05 * (postFedTaxSalary - 7847));
      } else if(postFedTaxSalary > 8968){ 
         stateIncomeTax = 291 + (.053 * (postFedTaxSalary - 8968));
      }
   }

   if(SelectedState == "Montana"){
      //source: https://montana.servicenowservices.com/citizen/kb?id=kb_article_view&sysparm_article=KB0014487
      if(postFedTaxSalary <= 3300){
         stateIncomeTax = .01 * postFedTaxSalary;
      } else if(postFedTaxSalary > 3300 && postFedTaxSalary <= 5800){ 
         stateIncomeTax = 33 + (.02 * (postFedTaxSalary - 3300));
      } else if(postFedTaxSalary > 5800 && postFedTaxSalary <= 8900){ 
         stateIncomeTax = 91 + (.03 * (postFedTaxSalary - 5800));
      } else if(postFedTaxSalary > 8900 && postFedTaxSalary <= 12000){ 
         stateIncomeTax = 180 + (.04 * (postFedTaxSalary - 12000));
      } else if(postFedTaxSalary > 12000 && postFedTaxSalary <= 15400){ 
         stateIncomeTax = 300 + (.05 * (postFedTaxSalary - 12000));
      } else if(postFedTaxSalary > 15400 && postFedTaxSalary <= 19800){ 
         stateIncomeTax = 454 + (.06 * (postFedTaxSalary - 15400));
      } else if(postFedTaxSalary > 19800){ 
         stateIncomeTax = 603 + (.0675 * (postFedTaxSalary - 603));
      } 
   }
   
   if(SelectedState == "Nebraska"){
      https://www.efile.com/nebraska-tax-brackets-rates-and-forms/
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 3440){
            stateIncomeTax = .0246 * postFedTaxSalary;
         } else if(postFedTaxSalary > 3440 && postFedTaxSalary <= 20590){ 
            stateIncomeTax = 84.62 + (.0351 * (postFedTaxSalary - 3440));
         } else if(postFedTaxSalary > 20590 && postFedTaxSalary <= 33180){ 
            stateIncomeTax = 686.59 + (.0501 * (postFedTaxSalary - 20590));
         } else if(postFedTaxSalary > 33180){ 
            stateIncomeTax = 1317.35 + (.0684 * (postFedTaxSalary - 33180));
         }
      } else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 6860){
               stateIncomeTax = .0246 * postFedTaxSalary;
            } else if(postFedTaxSalary > 6860 && postFedTaxSalary <= 41190){ 
               stateIncomeTax = 168.76 + (.0351 * (postFedTaxSalary - 6860));
            } else if(postFedTaxSalary > 41190 && postFedTaxSalary <= 66360){ 
               stateIncomeTax = 1373.74 + (.0501 * (postFedTaxSalary - 41190));
            } else if(postFedTaxSalary > 66360){ 
               stateIncomeTax = 2634.76 + (.0684 * (postFedTaxSalary - 66360));
            }
      }
   }
   
   
   
   if(SelectedState == "Nevada"){
      stateIncomeTax = 0;
   }

   
   if(SelectedState == "New Hampshire"){
      stateIncomeTax = 0;
   }
 
   if(SelectedState == "New Jersey"){
      //source: https://www.state.nj.us/treasury/taxation/taxtables.shtml
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 20000){
            stateIncomeTax = 0.014 * postFedTaxSalary;
         } else if(postFedTaxSalary > 20000 && postFedTaxSalary <= 35000){ 
            stateIncomeTax = 28 + ((.0175 * (postFedTaxSalary - 20000)) + 70);
         } else if(postFedTaxSalary > 35000 && postFedTaxSalary <= 40000){ 
            stateIncomeTax = 28 + 262.5 + ( (.035 * (postFedTaxSalary - 35000)) + 682.5);
         } else if(postFedTaxSalary > 40000 && postFedTaxSalary <= 75000){ 
            stateIncomeTax = 28 + 262.5 + 175 + ((.0525 * (postFedTaxSalary - 40000))+ 1492.50);
         } else if(postFedTaxSalary > 75000 && postFedTaxSalary <= 500000){ 
            stateIncomeTax = 28 + 262.5 + 175 + 1837.5 + ((.0637 * (postFedTaxSalary - 75000))+ 2126.25);
         } else if(postFedTaxSalary > 500000 && postFedTaxSalary <= 5000000){ 
            stateIncomeTax = 28 + 262.5 + 175 + 1837.5 + 27072.5 + ((.0897 * (postFedTaxSalary - 500000))+ 15126.25);
         } else if(postFedTaxSalary > 5000000){ 
            stateIncomeTax = 28 + 262.5 + 175 + 1837.5 + + 27072.5 + 403650 + ((.1075 * (postFedTaxSalary - 5000000))+ 34842.50);
         } 
         } else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 20000){
               stateIncomeTax = 0.014 * postFedTaxSalary;
            } else if(postFedTaxSalary > 20000 && postFedTaxSalary <= 50000){ 
               stateIncomeTax = 28 + ((.0175 * (postFedTaxSalary - 20000)) + 70);
            } else if(postFedTaxSalary > 50000 && postFedTaxSalary <= 70000){ 
               stateIncomeTax = 28 + 262.5 + ((.0245 * (postFedTaxSalary - 50000)) + 420);
            } else if(postFedTaxSalary > 70000 && postFedTaxSalary <= 80000){ 
               stateIncomeTax = 28 + 262.5 + 735 + ( (.035 * (postFedTaxSalary - 70000)) + 1154.50);
            } else if(postFedTaxSalary > 80000 && postFedTaxSalary <= 150000){ 
               stateIncomeTax = 28 + 262.5 + 735 + 350 + ((.0525 * (postFedTaxSalary - 80000))+ 2775);
            } else if(postFedTaxSalary > 150000 && postFedTaxSalary <= 500000){ 
               stateIncomeTax = 28 + 262.5 + 735 + 350 + 3675 + ((.0637 * (postFedTaxSalary - 150000))+ 2126.25);
            } else if(postFedTaxSalary > 500000 && postFedTaxSalary <= 5000000){ 
               stateIncomeTax = 28 + 262.5 + 735 + 350 + 3675 + 22295 + ((.0897 * (postFedTaxSalary - 500000))+ 4042.50);
            } else if(postFedTaxSalary > 5000000){ 
               stateIncomeTax = 28 + 262.5 + 735 + 350 + 3675 + 22295 + 403650 + ((.1075 * (postFedTaxSalary - 5000000))+ 34842.50);
            } 
         }
      
   }

   
   if(SelectedState == "New Mexico"){
      //source: https://www.efile.com/new-mexico-tax-brackets-rates-and-forms/
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 4000){
            stateIncomeTax = .017 * postFedTaxSalary;
         } else if(postFedTaxSalary > 4000 && postFedTaxSalary <= 8000){ 
            stateIncomeTax = 68 + (.032 * (postFedTaxSalary - 4000));
         } else if(postFedTaxSalary > 8000 && postFedTaxSalary <= 12000){ 
            stateIncomeTax = 196 + (.0407 * (postFedTaxSalary - 8000));
         }else if(postFedTaxSalary > 12000 && postFedTaxSalary <= 157500){ 
            stateIncomeTax = 384 + (.0409 * (postFedTaxSalary - 12000));
         } else if(postFedTaxSalary > 157500){ 
            stateIncomeTax = 7513.50 + (.059 * (postFedTaxSalary - 157500));
         }
      } else if(selectedFilingStatus == "Married"){
         if(postFedTaxSalary <= 8000){
            stateIncomeTax = .017 * postFedTaxSalary;
         } else if(postFedTaxSalary > 8000 && postFedTaxSalary <= 16000){ 
            stateIncomeTax = 136 + (.032 * (postFedTaxSalary - 8000));
         } else if(postFedTaxSalary > 16000 && postFedTaxSalary <= 24000){ 
            stateIncomeTax = 392 + (.0505 * (postFedTaxSalary - 16000));
         }else if(postFedTaxSalary > 24000 && postFedTaxSalary <= 315000){ 
            stateIncomeTax = 768 + (.0409 * (postFedTaxSalary - 24000));
         } else if(postFedTaxSalary > 315000){ 
            stateIncomeTax = 15027 + (.059 * (postFedTaxSalary - 315000));
         }
      }

   }
   
   if(SelectedState == "New York"){
      //source: https://www.efile.com/new-york-tax-rates-forms-and-brackets/
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 8500){
            stateIncomeTax = 0.04 * postFedTaxSalary;
         } else if(postFedTaxSalary > 8500 && postFedTaxSalary <= 11700){ 
            stateIncomeTax = 340 + (.045 * (postFedTaxSalary - 8500));
         } else if(postFedTaxSalary > 11700 && postFedTaxSalary <= 13900){ 
            stateIncomeTax = 484 + (.0525 * (postFedTaxSalary - 11700));
         } else if(postFedTaxSalary > 13900 && postFedTaxSalary <= 11400){ 
            stateIncomeTax = 600 + (.059 * (postFedTaxSalary - 13900));
         } else if(postFedTaxSalary > 11400 && postFedTaxSalary <= 80650){ 
            stateIncomeTax = 1042 + (.0597 * (postFedTaxSalary - 11400));
         } else if(postFedTaxSalary > 80650 && postFedTaxSalary <= 215400){ 
            stateIncomeTax = 4579 + (.0633 * (postFedTaxSalary - 80650));
         } else if(postFedTaxSalary > 215400 && postFedTaxSalary <= 1077550){ 
            stateIncomeTax = 13109 + (.0685 * (postFedTaxSalary - 215400));
         } else if(postFedTaxSalary > 1077550 && postFedTaxSalary <= 5000000){ 
            stateIncomeTax = 72166 + (.0965 * (postFedTaxSalary - 10775500));
         } else if(postFedTaxSalary > 5000000 && postFedTaxSalary <= 25000000){ 
            stateIncomeTax = 450683 + (.103 * (postFedTaxSalary - 5000000));
         } else if(postFedTaxSalary > 25000000){ 
            stateIncomeTax = 2510683 + (.109 * (postFedTaxSalary - 25000000));
         } } else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 17150){
               stateIncomeTax = 0.04 * postFedTaxSalary;
            } else if(postFedTaxSalary > 17150 && postFedTaxSalary <= 23600){ 
               stateIncomeTax = 686 + (.045 * (postFedTaxSalary - 17150));
            } else if(postFedTaxSalary > 23600 && postFedTaxSalary <= 27900){ 
               stateIncomeTax = 976 + (.0525 * (postFedTaxSalary - 23600));
            } else if(postFedTaxSalary > 27900 && postFedTaxSalary <= 43000){ 
               stateIncomeTax = 1202 + (.059 * (postFedTaxSalary - 27900));
            } else if(postFedTaxSalary > 43000 && postFedTaxSalary <= 161550){ 
               stateIncomeTax = 2093 + (.0597 * (postFedTaxSalary - 43000));
            } else if(postFedTaxSalary > 161550 && postFedTaxSalary <= 323200){ 
               stateIncomeTax = 9170 + (.0633 * (postFedTaxSalary - 161550));
            } else if(postFedTaxSalary > 323200 && postFedTaxSalary <= 2155350){ 
               stateIncomeTax = 19403 + (.0685 * (postFedTaxSalary - 323200));
            } else if(postFedTaxSalary > 2155350 && postFedTaxSalary <= 5000000){ 
               stateIncomeTax = 144905 + (.0965 * (postFedTaxSalary - 2155350));
            } else if(postFedTaxSalary > 5000000 && postFedTaxSalary <= 25000000){ 
               stateIncomeTax = 419414 + (.103 * (postFedTaxSalary - 5000000));
            } else if(postFedTaxSalary > 25000000){ 
               stateIncomeTax = 2479414 + (.109 * (postFedTaxSalary - 25000000));
            }
         }
      }
      
   
   
   
   if(SelectedState == "North Carolina"){
      //source: https://www.ncdor.gov/taxes-forms/tax-rate-schedules
      stateIncomeTax = amount * .0499;
   }
    
   if(SelectedState == "North Dakota"){
      //source: https://www.efile.com/north-dakota-tax-brackets-rates-and-forms/
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 41775){
            stateIncomeTax = 0.011 * postFedTaxSalary;
         } else if(postFedTaxSalary > 41775 && postFedTaxSalary <= 101050){ 
            stateIncomeTax = 459.53 + (.0204 * (postFedTaxSalary - 41775));
         } else if(postFedTaxSalary > 101050 && postFedTaxSalary <= 210825){ 
            stateIncomeTax = 1668.74 + (.0227 * (postFedTaxSalary - 101050));
         } else if(postFedTaxSalary > 210825 && postFedTaxSalary <= 448350){ 
            stateIncomeTax = 4160.63 + (.0264 * (postFedTaxSalary - 210825));
         } else if(postFedTaxSalary > 448350){ 
            stateIncomeTax = 10695.29 + (.029 * (postFedTaxSalar - 448350));
         }} else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 69700){
               stateIncomeTax = 0.011 * postFedTaxSalary;
            } else if(postFedTaxSalary > 69700 && postFedTaxSalary <= 168450){ 
               stateIncomeTax = 776.70 + (.0204 * (postFedTaxSalary - 69700));
            } else if(postFedTaxSalary > 168450 && postFedTaxSalary <= 249150){ 
               stateIncomeTax = 2700.04 + (.0227 * (postFedTaxSalary - 168450));
            } else if(postFedTaxSalary > 249150 && postFedTaxSalary <= 448350){ 
               stateIncomeTax = 4793.34 + (.0264 * (postFedTaxSalary - 249150));
            } else if(postFedTaxSalary > 448350){ 
               stateIncomeTax = 10108.22 + (.029 * (postFedTaxSalar - 448350));
            }
         }
      }
   
   if(SelectedState == "Ohio"){
      //source = https://tax.ohio.gov/individual/resources/annual-tax-rates
         if(postFedTaxSalary <= 26050){
            stateIncomeTax = 0;
         } else if(postFedTaxSalary > 26050 && postFedTaxSalary <= 46100){ 
            stateIncomeTax = 360.69 + (.0276 * (postFedTaxSalary - 26050));
         } else if(postFedTaxSalary > 46100 && postFedTaxSalary <= 92150){ 
            stateIncomeTax = 915.07 + (.03226 * (postFedTaxSalary - 46100));
         } else if(postFedTaxSalary > 92150 && postFedTaxSalary <= 115300){ 
            stateIncomeTax = 2400.64 + (.03688 * (postFedTaxSalary - 92150));
         } else if(postFedTaxSalary > 115300){ 
            stateIncomeTax = 3254.41 + (.03990 * (postFedTaxSalar - 115300));
         }
   }
   
  
   if(SelectedState == "Oregon"){
      //source = https://www.oregon.gov/dor/programs/individuals/pages/rates-tables.aspx
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 3650){
            stateIncomeTax = 0.0475 * postFedTaxSalary;
         } else if(postFedTaxSalary > 3650 && postFedTaxSalary <= 9200){ 
            stateIncomeTax = 173 + (.0675 * (postFedTaxSalary - 3650));
         } else if(postFedTaxSalary > 9200 && postFedTaxSalary <= 125000){ 
            stateIncomeTax = 548 + (.0875 * (postFedTaxSalary - 9200));
         } else if(postFedTaxSalary > 1250000){ 
            stateIncomeTax = 10681 + (.099 * (postFedTaxSalary - 125000));
         }} else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 7300){
               stateIncomeTax = 0.0475 * postFedTaxSalary;
            } else if(postFedTaxSalary > 7300 && postFedTaxSalary <= 18400){ 
               stateIncomeTax = 347 + (.0675 * (postFedTaxSalary - 7300));
            } else if(postFedTaxSalary > 18400 && postFedTaxSalary <= 250000){ 
               stateIncomeTax = 1096 + (.0875 * (postFedTaxSalary - 18400));
            } else if(postFedTaxSalary > 250000){ 
               stateIncomeTax = 213651 + (.099 * (postFedTaxSalary - 250000));
            }
         }
      }
         
   
   if(SelectedState == "Oklahoma"){
      //source = https://www.efile.com/oklahoma-tax-brackets-rates-and-forms/
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 1000){
            stateIncomeTax = 0.0025 * postFedTaxSalary;
         } else if(postFedTaxSalary > 1000 && postFedTaxSalary <= 2500){ 
            stateIncomeTax = 2.50 + (.0075 * (postFedTaxSalary - 1000));
         } else if(postFedTaxSalary > 2500 && postFedTaxSalary <= 3750){ 
            stateIncomeTax = 13.75 + (.0175 * (postFedTaxSalary - 2500));
         } else if(postFedTaxSalary > 3750 && postFedTaxSalary <= 4900){ 
            stateIncomeTax = 35.73 + (.0275 * (postFedTaxSalary - 3750));
         } else if(postFedTaxSalary > 4900 && postFedTaxSalary <= 7200){ 
            stateIncomeTax = 67.25 + (.0375 * (postFedTaxSalary - 4900));
         } else if(postFedTaxSalary > 7200){ 
            stateIncomeTax = 153.50 + (.0475 * (postFedTaxSalary - 7200));
         } }else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 2000){
               stateIncomeTax = 0.0025 * postFedTaxSalary;
            } else if(postFedTaxSalary > 2000 && postFedTaxSalary <= 5000){ 
               stateIncomeTax = 5 + (.0075 * (postFedTaxSalary - 2000));
            } else if(postFedTaxSalary > 5000 && postFedTaxSalary <= 7500){ 
               stateIncomeTax = 27.50 + (.0175 * (postFedTaxSalary - 5000));
            } else if(postFedTaxSalary > 7500 && postFedTaxSalary <= 9800){ 
               stateIncomeTax = 71.25 + (.0275 * (postFedTaxSalary - 7500));
            } else if(postFedTaxSalary > 9800 && postFedTaxSalary <= 12200){ 
               stateIncomeTax = 134.50 + (.0375 * (postFedTaxSalary - 9800));
            } else if(postFedTaxSalary > 12200){ 
               stateIncomeTax = 224.50 + (.0475 * (postFedTaxSalary - 12200));
            } 
         }
      }
      
   
   
   if(SelectedState == "Pennsylvania"){
      //source: https://www.revenue.pa.gov/TaxTypes/PIT/Pages/default.aspx
      stateIncomeTax = amount * .0307
   }
   
   
   if(SelectedState == "Rhode Island"){
      //source: https://www.efile.com/rhode-island-tax-brackets-rates-and-forms/
      if(postFedTaxSalary <= 68200){
         stateIncomeTax = .0375 * postFedTaxSalary;
      } else if(postFedTaxSalary > 68200 && postFedTaxSalary <= 155050){ 
         stateIncomeTax = 2557.5 + (.0475 * (postFedTaxSalary - 68200));
      } else if(postFedTaxSalary > 155050){ 
         stateIncomeTax = 6682.88 + (.0599 * (postFedTaxSalary - 155050));
      }
   }
   
   if(SelectedState == "South Carolina"){
      //source: https://www.efile.com/south-carolina-tax-rates-brackets-and-forms/
      if(postFedTaxSalary <= 3200){
         stateIncomeTax = 0;
      } else if(postFedTaxSalary > 3200 && postFedTaxSalary <= 6410){ 
         stateIncomeTax = (.03 * (postFedTaxSalary - 3200));
      } else if(postFedTaxSalary > 6410 && postFedTaxSalary <= 9620){ 
         stateIncomeTax = 96 + (.04 * (postFedTaxSalary - 6410));
      }else if(postFedTaxSalary > 9620 && postFedTaxSalary <= 12820){ 
         stateIncomeTax = 224 + (.05 * (postFedTaxSalary - 6410));
      }else if(postFedTaxSalary > 12820 && postFedTaxSalary <= 16040){ 
         stateIncomeTax = 384 + (.06 * (postFedTaxSalary - 12820));
      }else if(postFedTaxSalary > 16040){
         stateIncomeTax = 577.2 + (.07 * (postFedTaxSalary - 16040));
      }
   }

   
   if(SelectedState == "South Dakota"){
      stateIncomeTax = 0;
   }
   
   if(SelectedState == "Tennessee"){
      stateIncomeTax = 0;
   }
  
   if(SelectedState == "Texas"){
      stateIncomeTax = 0;
   }
   
   
   if(SelectedState == "Utah"){
      //source: https://incometax.utah.gov/paying/tax-rates
      stateIncomeTax = amount * .0485;
   }

  
   if(SelectedState == "Vermont"){
      //source: https://www.efile.com/vermont-tax-brackets-rates-and-forms/
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 42150){
            stateIncomeTax = 0.0335 * postFedTaxSalary;
         } else if(postFedTaxSalary > 42150 && postFedTaxSalary <= 102200){ 
            stateIncomeTax = 1412 + (.066 * (postFedTaxSalary - 42150));
         } else if(postFedTaxSalary > 102200 && postFedTaxSalary <= 213150){ 
            stateIncomeTax = 5375 + (.0760 * (postFedTaxSalary - 102200));
         } else if(postFedTaxSalary > 213150){ 
            stateIncomeTax = 13808 + (.0875 * (postFedTaxSalary - 213150));
         }}else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 70450){
               stateIncomeTax = 0.0335 * postFedTaxSalary;
            } else if(postFedTaxSalary > 70450 && postFedTaxSalary <= 170300){ 
               stateIncomeTax = 2360 + (.066 * (postFedTaxSalary - 70450));
            } else if(postFedTaxSalary > 170300 && postFedTaxSalary <= 259500){ 
               stateIncomeTax = 8950 + (.0760 * (postFedTaxSalary - 102200));
            } else if(postFedTaxSalary > 259500){ 
               stateIncomeTax = 15729 + (.0875 * (postFedTaxSalary - 259500));
            }
         }
   } 
   
   
   if(SelectedState == "Virginia"){
      //source: https://www.efile.com/vermont-tax-brackets-rates-and-forms/
      if(postFedTaxSalary <= 3000){
         stateIncomeTax = 0.02 * postFedTaxSalary;
      } else if(postFedTaxSalary > 3000 && postFedTaxSalary <= 5000){ 
         stateIncomeTax = 60 + (.03 * (postFedTaxSalary - 3000));
      } else if(postFedTaxSalary > 5000 && postFedTaxSalary <= 17000){ 
         stateIncomeTax = 120 + (.05 * (postFedTaxSalary - 5000));
      } else if(postFedTaxSalary > 17000){ 
         stateIncomeTax = 720 + (.0575 * (postFedTaxSalary - 17000));
      }
   }
   
   if(SelectedState == "Washington"){
      stateIncomeTax = 0;
   }
   
   
   if(SelectedState == "Washington DC"){
       //source: https://www.efile.com/vermont-tax-brackets-rates-and-forms/
       if(postFedTaxSalary <= 10000){
         stateIncomeTax = 0.04 * postFedTaxSalary;
      } else if(postFedTaxSalary > 10000 && postFedTaxSalary <= 40000){ 
         stateIncomeTax = 4000 + (.06 * (postFedTaxSalary - 10000));
      } else if(postFedTaxSalary > 40000 && postFedTaxSalary <= 60000){ 
         stateIncomeTax = 2200 + (.065 * (postFedTaxSalary - 40000));
      } else if(postFedTaxSalary > 60000 && postFedTaxSalary <= 250000){ 
         stateIncomeTax = 3500 + (.085 * (postFedTaxSalary - 60000));
      } else if(postFedTaxSalary > 250000 && postFedTaxSalary <= 500000){ 
         stateIncomeTax = 19650 + (.0925 * (postFedTaxSalary - 250000));
      } else if(postFedTaxSalary > 500000 && postFedTaxSalary <= 1000000){ 
         stateIncomeTax = 42775 + (.0975 * (postFedTaxSalary - 500000));
      } else if(postFedTaxSalary > 1000000){ 
         stateIncomeTax = 91525 + (.1075 * (postFedTaxSalary - 1000000));
      }
   }
   
   
   if(SelectedState == "West Virginia"){
      //source = https://www.efile.com/west-virginia-tax-brackets-rates-and-forms/
         if(postFedTaxSalary <= 10000){
            stateIncomeTax = 0.03 * postFedTaxSalary;
         } else if(postFedTaxSalary > 10000 && postFedTaxSalary <= 25000){ 
            stateIncomeTax = 300 + (.04 * (postFedTaxSalary - 10000));
         } else if(postFedTaxSalary > 25000 && postFedTaxSalary <= 40000){ 
            stateIncomeTax = 900 + (.045 * (postFedTaxSalary - 25000));
         } else if(postFedTaxSalary > 40000 && postFedTaxSalary <= 60000){ 
            stateIncomeTax = 1575 + (.06 * (postFedTaxSalary - 40000));
         } else if(postFedTaxSalary > 60000){ 
            stateIncomeTax = 27755 + (.065 * (postFedTaxSalary - 60000));
         } 
   }
   
   
   if(SelectedState == "Wisconsin"){
      //source = https://www.efile.com/west-virginia-tax-brackets-rates-and-forms/
      if(selectedFilingStatus == "Single"){
         if(postFedTaxSalary <= 12760){
            stateIncomeTax = 0.0354 * postFedTaxSalary;
         } else if(postFedTaxSalary > 12760 && postFedTaxSalary <= 25520){ 
            stateIncomeTax = 451.70 + (0.0465 * (postFedTaxSalary - 12760));
         } else if(postFedTaxSalary > 25520 && postFedTaxSalary <= 280950){ 
            stateIncomeTax = 1045.04 + (.0627 * (postFedTaxSalary - 25520));
         } else if(postFedTaxSalary > 280950){ 
            stateIncomeTax = 14582.83 + (.0765 * (postFedTaxSalary - 280950));
         }}else if(selectedFilingStatus == "Married"){
            if(postFedTaxSalary <= 17010){
               stateIncomeTax = 0.0354 * postFedTaxSalary;
            } else if(postFedTaxSalary > 17010 && postFedTaxSalary <= 34030){ 
               stateIncomeTax = 602.15 + (0.0465 * (postFedTaxSalary - 17010));
            } else if(postFedTaxSalary > 34030 && postFedTaxSalary <= 374600){ 
               stateIncomeTax = 1393.58 + (.0627 * (postFedTaxSalary - 34030));
            } else if(postFedTaxSalary > 374600){ 
               stateIncomeTax = 19443.79 + (.0765 * (postFedTaxSalary - 374600));
            }
         }
      }

   if(SelectedState == "Wyoming"){
      stateIncomeTax = 0;
   }

   postTaxSalary = (preTaxSalary.value - fedTax - stateIncomeTax).toFixed(2);
   postTaxSalaryDesc.innerHTML = postTaxSalary;
   postTax.innerHTML = postTaxSalary;
   totalTax.innerHTML = (fedTax + stateIncomeTax).toFixed(2);
   federalTax.innerHTML = fedTax.toFixed(2);
   stateTax.innerHTML = (stateIncomeTax).toFixed(2);

   

   let yValues = [postTaxSalary, fedTax, stateIncomeTax]; 

   new Chart(myChart, {
   type: 'pie',
   data: {
    labels:["After Tax Salary", "Federal Tax", "State Tax"],
    datasets: [{
      data: yValues,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
    }]
  },
});
});

//code to assist with displaying capital gains tax visually

var mapData = [ 
     ['AL', 5.0], 
     ['AK', 0], 
     ['AZ', 4.5], 
     ['AR', 5.5], 
     ['CA', 13.3], 
     ['CO', 4.55], 
     ['CT', 6.99], 
     ['DE', 6.60], 
     ['FL', 0], 
     ['GA', 5.75], 
     ['HI', 7.25], 
     ['ID', 6.93], 
     ['IL', 4.95], 
     ['IN', 3.23], 
     ['IA', 8.53], 
     ['KS', 5.7], 
     ['KY', 5.0], 
     ['LA', 4.25], 
     ['ME', 7.15], 
     ['MD', 5.75], 
     ['MA', 5.0], 
     ['MI', 4.25], 
     ['MN', 9.85], 
     ['MS', 5.0], 
     ['MO', 5.40], 
     ['MT', 6.90], 
     ['NE', 6.84], 
     ['NV', 0], 
     ['NH', 0], 
     ['NJ', 10.75], 
     ['NM', 5.90], 
     ['NY', 8.82], 
     ['NC', 4.99], 
     ['ND', 2.90], 
     ['OH', 4.80], 
     ['OK', 4.75], 
     ['OR', 9.90], 
     ['PA', 3.07], 
     ['RI', 5.99], 
     ['SC', 7.00], 
     ['SD', 0], 
     ['TN', 0], 
     ['TX', 0], 
     ['UT', 4.95], 
     ['VT', 8.75], 
     ['VA', 5.75], 
     ['WA', 7.00], 
     ['WV', 6.50], 
     ['WI', 7.65], 
     ['WY', 0] 
   ]; 
     
   var chart = JSC.chart('chartDiv', { 
     debug: true, 
     type: 'map', 
     title_label_text: 
       'capital gains tax rate by US State', 
     palette: { 
       /* A function to get the point value performs better. */
       pointValue: function(p) { 
         return p.options('z'); 
       }, 
       colors: [ 
         '#ffffcc', 
         '#ffeda0', 
         '#fed976', 
         '#feb24c', 
         '#fd8d3c', 
         '#fc4e2a', 
         '#e31a1c', 
         '#bd0026', 
         '#b00026'
       ], 
       ranges: { min: 0, max: 14, interval: 2 } 
     }, 
     legend_title_label_text: 'capital gains tax rate %:', 
     
     defaultPoint: { 
       label_text: '%stateCode', 
       tooltip: 
         '<b>%name</b> <br/>Capital Gains Tax Highest Percent: %zValue% <br/>'
     }, 
     
     /* Pad the map data points for separation from the chart area boundary. */
     defaultSeries_shape_padding: 0.02, 
     series: [ 
       { 
         map: 'us', 
         points: mapData.map(function(arrItem) { 
           return { 
             map: 'US.' + arrItem[0], 
             z: arrItem[1] 
           }; 
         }) 
       } 
     ] 
   }); 

