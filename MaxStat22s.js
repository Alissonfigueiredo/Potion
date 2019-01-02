var classes = { //lists are in this order: hp,mp,att,def,spd,dex,vit,wis
	"Wizard":{"av":[575,290,40,0,29,43,21,31],"max":[670,385,75,25,50,75,40,60]},
	"Priest":{"av":[575,290,31,0,40,31,19,43],"max":[670,385,50,25,55,55,40,75]},
	"Archer":{"av":[605,195,40,0,31,31,21,29],"max":[700,252,75,25,50,50,40,50]},
	"Rogue":{"av":[625,195,29,0,43,43,24,29],"max":[720,252,50,25,75,75,40,50]},
	"Warrior":{"av":[675,195,43,0,26,29,38,29],"max":[770,252,75,25,50,50,75,50]},
	"Necromancer":{"av":[575,290,40,0,29,43,19,40],"max":[670,385,75,25,50,60,30,75]},
	"Assassin":{"av":[625,195,31,0,43,43,24,38],"max":[720,252,60,25,75,75,40,60]},
	"Huntress":{"av":[605,195,40,0,31,31,21,29],"max":[700,252,75,25,50,50,40,50]},
	"Knight":{"av":[675,195,43,0,26,29,38,29],"max":[770,252,50,40,50,50,75,50]},
	"Paladin":{"av":[675,195,40,0,31,29,19,38],"max":[770,252,50,30,55,45,40,75]},
	"Sorcerer":{"av":[575,290,40,0,40,31,38,43],"max":[670,385,70,25,60,60,75,60]},
	"Mystic":{"av":[575,290,38,0,31,29,24,43],"max":[670,385,60,25,75,75,40,75]},
	"Trickster":{"av":[625,195,38,0,40,43,21,31],"max":[720,252,65,25,75,75,40,60]},
	"Ninja":{"av":[625,195,43,0,29,40,19,40],"max":[720,252,70,25,60,70,40,70]},
	"Samurai":{"av":[625,195,40,0,29,29,19,40],"max":[720,252,75,25,50,50,40,60]}
};

var incr_stats = [5,5,1,1,1,1,1,1];
var discount = 0.8; //percent from 0-1

var min_denomations = [
{num:8,price:50000,packid:"27545030469"},
{num:8,price:50000,packid:"27545053701"},
{num:16,price:599,packid:"28707024133"},
{num:16,price:599,packid:"28707043013"},
{num:16,price:399,packid:"28707188677"},
{num:8,price:199,packid:"35633532869"},
{num:16,price:599,packid:"28707240005"},
{num:8,price:199,packid:"27545053189"}
]

var selectedMode = 0;
var modes = [
{ele:"rs-simple-mod",desc:"<strong>Average Stat Maxing Packs</strong><br>are guaranteed to max characters with average stats."},
{ele:"rs-manual-mod",desc:"<strong>Input your Base Stats</strong><br> and we'll provide enough potions to max that character!"}
]
var selected = [true,true,true,true,true,true,true,true];
var selected2 = [true,true,true,true,true,true,true,true];
var potbuttons = document.getElementsByClassName('rs-stat-button');
var switchButtons = document.getElementsByClassName('rs-stat-switch-button');
var manualInputs = document.getElementsByClassName('rs-manual-input-field');
var manualChecks = document.getElementsByClassName('rs-manual-check');
var manualMsgs = document.getElementsByClassName('lower-title');

var allowedKeys = [48,49,50,51,52,53,54,55,56,57,8,37,38,39,40];
for(var h =0;h< manualInputs.length;h++){
	manualInputs[h].addEventListener('keydown', function(evt){
		if(!allowedKeys.includes(evt.keyCode)){
			evt.preventDefault();
		}else{
			setTimeout(calc_and_display_price,10);
		}
	})
}
for(var k = 0; k < manualChecks.length; k++){
	manualChecks[k].onclick = function(){
		for(var j = 0;j<manualInputs.length;j++){
			if(manualInputs[j].getAttribute("val") == this.getAttribute("val")){
				manualInputs[j].disabled = !this.checked
				manualInputs[j].classList.toggle("disabled-input");
				selected2[parseInt(this.getAttribute("val"))] = this.checked;
				calc_and_display_price();
			}
		}
	}
}
for(var k = 0; k < potbuttons.length; k++){
	potbuttons[k].onclick = function(){
		selected[parseInt(this.getAttribute("val"))] = !selected[parseInt(this.getAttribute("val"))];
		this.classList.toggle("clicked");
		calc_and_display_price();
	}
}
document.getElementById('rs-choose-class').addEventListener("click", function(){
	fill_in_inputs();
	calc_and_display_price();
});
function fill_in_inputs(){
	var selectedOpt = document.getElementById('rs-choose-class').options[document.getElementById('rs-choose-class').selectedIndex].value;
	for(var h =0;h< manualInputs.length;h++){
		manualInputs[h].value = classes[selectedOpt].av[parseInt(manualInputs[h].getAttribute("val"))];
	}
}

function switch_mode_click(elmnt){

	if(!elmnt.classList.contains("max-clicked")){
		for(var n = 0 ; n < switchButtons.length;n++){
			if(switchButtons[n].classList.contains("max-clicked"))switchButtons[n].classList.toggle("max-clicked");
		}
		selectedMode = parseInt(elmnt.getAttribute("val"));
		elmnt.classList.toggle("max-clicked");
		for(var n = 0;n < modes.length;n++){
			if(n == selectedMode){
				document.getElementById(modes[n].ele).style["z-index"] = 1;
				document.getElementById(modes[n].ele).style.animation = 'go-up 0.5s forwards';
			}else{
				document.getElementById(modes[n].ele).style["z-index"] = 0;
				document.getElementById(modes[n].ele).style.animation = 'go-down 0.5s forwards';
			}
		}
		calc_and_display_price();
	}
	document.getElementById("rs-message").innerHTML = modes[selectedMode].desc;
}

for(var k = 0; k < switchButtons.length; k++){
	switchButtons[k].onclick = function(){
		switch_mode_click(this)
	}
	if(switchButtons[k].classList.contains("max-clicked")){
		switch_mode_click(switchButtons[k]);
	}
}

function update_manual_msg(showBool,statIndex,statsToGo){
	if(showBool){
		manualMsgs[statIndex].innerHTML = statsToGo + " to go!";
	}else{
		manualMsgs[statIndex].innerHTML = "";
	}
}

function calc_and_display_price(){
    var list_of_stats = [];
    var countTrues = 0;
    var selectedOpt = document.getElementById('rs-choose-class').options[document.getElementById('rs-choose-class').selectedIndex].value;
    if(selectedMode == 0){
	    for(var j = 0;j< selected.length;j++){
	        if(selected[j] == true){
	            list_of_stats.push(classes[selectedOpt].max[j]-classes[selectedOpt].av[j])
	            countTrues++;
	        }else{
	            list_of_stats.push(0);
	        }
	    }
	}else if(selectedMode == 1){
		list_of_stats = [0,0,0,0,0,0,0,0];
		for(var h =0;h< manualInputs.length;h++){
			var valueStat = parseInt(manualInputs[h].value);
			var index = parseInt(manualInputs[h].getAttribute("val"));
			if(selected2[index] == true){
				manualInputs[h].style.color = "#fff";
				if(valueStat>=classes[selectedOpt].max[index] && !isNaN(valueStat)){
					manualInputs[h].style.color = "#ff0";
					manualInputs[h].value=classes[selectedOpt].max[index];
					valueStat = parseInt(manualInputs[h].value);
					countTrues++;
				}else if(isNaN(valueStat)){
					valueStat = 0;
				}
				list_of_stats[index] = classes[selectedOpt].max[index]-valueStat;
			}else{
				countTrues++;
			}
			update_manual_msg(selected2[index],index,classes[selectedOpt].max[index]-valueStat);
		}
		countTrues = 8-countTrues;
	}
    var result = lowest_cost(list_of_stats);
    var total = 0;
    for(var h in result){
        if(h == "37667831237"){
            total += Math.ceil(159*result[h]*discount);
        }else{
            for(var g in min_denomations){
                if(min_denomations[g].packid == h){
                    total += Math.ceil(min_denomations[g].price*result[h]*discount)
                    break;
                }
            }
        }
    }
    document.getElementById('rs-maxme-cost').innerHTML = "R$" + (total/100).toFixed(2) + "Reais"
    document.getElementById('rs-buy-button').innerHTML = "Comprar " + countTrues + "/8";
    document.getElementById('rs-buy-button').onclick = function(){
        var block = "http://www.caep.com.br/site-em-construcao.html";
        var elements = [];
        for(var h in result)elements.push(h+":"+result[h]);
        block += elements.join(",") + "?discount=bulkpotions&amp;ref=maxing-packs?note=" + selectedOpt + "-" + countTrues + "-" + selectedMode;
        window.open(block);
    }
    document.getElementById("rs-buy-button").disabled = total==0;
}

function lowest_cost(list_of_stats){
//parameter is a list of 8 elements (of raw stats needed per stat): hp,mp,att,def,spd,dex,vit,wis
//price will begin as 0 and as we recurse;
	var result = {};

	if(count_min(0,list_of_stats)==8){
		return result;
	}

	for(var h in list_of_stats){
		while(list_of_stats[h] >= min_denomations[h].num*incr_stats[h]){
			list_of_stats[h] -= min_denomations[h].num*incr_stats[h];
			add_to_mem(result,min_denomations[h].packid);
		}
	//at this stage, we cannot fit anymore 16x/8x packs into our list, so we must consider the 8x rainbow potions
	//now we must use recursion to see which one is the cheapest.
	var aaa = recursive_helper(0,[],list_of_stats);
	for(var g in aaa[1])add_to_mem(result,aaa[1][g]);
	return result;
}

function recursive_helper(memtotal,memids,list_of_stats){
function count_min(min,list){
	var total = 0;
	for(var n in list){
		if(list[n] <= min)total++;
	}
	return total;

document.getElementById("rs-maxme-contain").style["font-size"] = document.getElementById("rs-maxme-contain").offsetWidth/80 + "px";
window.addEventListener('resize',function(evt){
	document.getElementById("rs-maxme-contain").style["font-size"] = document.getElementById("rs-maxme-contain").offsetWidth/80 + "px";
});
calc_and_display_price();
fill_in_inputs();
