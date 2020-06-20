function generateScroll(id, layout, param){
	let childrenCount = null;
	let scrollPerson = false;

	let prelayout = document.createElement('div');
	layout.style.overflow = "hidden";
	layout.style.position = "relative";
	layout.style.height = param.height;
	layout.style.width = param.width;

	let block = document.createElement('div');
	block.style.overflowX = 'hidden';
	block.style.overflowY = 'scroll';
	block.style.height = "100%";
	block.style.width = "115%";
	block.style.paddingRight = "13.75%";
	block.style.marginRight = "15%";

	let bodyBlock = document.getElementById(id);

	let scrollBar = document.createElement('div');
	scrollBar.class = "scroll";

	scrollBar.style.height = (Math.pow(block.clientHeight, 2) / bodyBlock.clientHeight) + 'px';

	for (var i = 0; i < bodyBlock.children.length; i++) {	
		childrenCount += bodyBlock.children[i].clientHeight;
		var style = window.getComputedStyle(bodyBlock.children[i]);
		var marginTop = style.getPropertyValue('margin-top'); 
		var marginBottom = style.getPropertyValue('margin-bottom'); 
		childrenCount += Number(marginTop.substring(0, marginTop.length - 2));
		childrenCount += Number(marginBottom.substring(0, marginBottom.length - 2));
	}
	childrenCount /= block.clientHeight;
	
	if(bodyBlock.clientHeight < block.clientHeight) scrollBar.style.display = 'none'
	else scrollBar.style.display = 'block';

	block.onscroll = function(){
		if(block.clientHeight <  bodyBlock.clientHeight && scrollPerson == false){
			scrollBar.style.height = (Math.pow(block.clientHeight, 2) / bodyBlock.clientHeight) + 'px';
			scrollBar.style.top = (block.scrollTop/childrenCount) + 'px'; 
		}
	}			

	scrollBar.addEventListener('onmousedown',()=>{
		scrollPerson = true;
		document.onmousedown = function(){return false};
		let div = document.createElement('div');
		let rect = block.getBoundingClientRect();
		div.style.width = '100vw';
		div.style.top = rect.top + 'px';
		div.style.bottom = rect.bottom + 'px';
		div.style.height = rect.height + 'px';
		div.style.background = "transparent";
		div.style.position = 'absolute';
		div.id = 'scrollInvise';
		div.style.zIndex = 10000;
		document.body.appendChild(div);		
			document.onmousemove = function(e){
				scrollBar.style.height = (Math.pow(block.clientHeight, 2) / bodyBlock.clientHeight) + 'px';
				scrollBar.style.top = (block.scrollTop/childrenCount) + 'px';
				if(e.target.id == 'scrollInvise'){
					let y = e.offsetY - (scrollBar.clientHeight/2);
					block.scrollTop = (childrenCount * y);
				}else if(e.clientY <= rect.top){
					block.scrollTop = 0;	
				}else{
					block.scrollTop = bodyBlock.offsetHeight;
				}
			}
		document.onmouseup = function(){
			document.onmousedown = function(){scrollPerson = false;};
			document.onmousemove = function(){scrollPerson = false;};
			document.body.removeChild(div);
		}
	})

	block.appendChild(bodyBlock);
	block.appendChild(scrollBar);
	prelayout.appendChild(block);
	layout.appendChild(prelayout);
}
