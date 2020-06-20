function generateScroll(id, layout, param, count, blocks){
	let childrenCount = 0;
	let scrollPerson = false;

	let bodyBlock = document.getElementById(id);
	if(!count) count = 1;
	if(!blocks) blocks = 1;
	for (let i = 0; i < layout.children.length; i++) {
		if(layout.children[i].id == 'prelayout' && count >= blocks){
			layout.removeChild(layout.querySelector('#prelayout'));
		} 
	}

	let prelayout = document.createElement('div');
	prelayout.style.overflow = "hidden";
	prelayout.style.position = "relative";
	prelayout.style.height = param.height;
	prelayout.style.width = param.width;
	prelayout.id = "prelayout";

	let block = document.createElement('div');
	block.style.overflowX = 'hidden';
	block.style.overflowY = 'scroll';
	block.style.height = "100%";
	block.style.width = "115%";
	block.style.paddingRight = "13.75%";
	block.style.marginRight = "15%";

	let scrollBar = document.createElement('div');
	scrollBar.classList.add("scroll");
	
	block.appendChild(bodyBlock);
	block.appendChild(scrollBar);
	prelayout.appendChild(block);
	layout.appendChild(prelayout);


	scrollBar.style.height = (Math.pow(block.clientHeight, 2) / bodyBlock.clientHeight) + 'px';

	for (let i = 0; i < bodyBlock.children.length; i++) {	
		childrenCount += bodyBlock.children[i].clientHeight;
		let style = window.getComputedStyle(bodyBlock.children[i]);
		let marginTop = style.getPropertyValue('margin-top'); 
		let marginBottom = style.getPropertyValue('margin-bottom'); 
		childrenCount += Number(marginTop.substring(0, marginTop.length - 2));
		childrenCount += Number(marginBottom.substring(0, marginBottom.length - 2));
	}
	childrenCount /= block.clientHeight;
	if(bodyBlock.clientHeight < block.clientHeight) scrollBar.style.display = 'none'
	else scrollBar.style.display = 'block';

	

	block.onscroll = ()=>{
		if(bodyBlock.clientHeight > block.clientHeight) scrollBar.style.display = "block";
		if(block.clientHeight <  bodyBlock.clientHeight && scrollPerson == false){
			scrollBar.style.height = (Math.pow(block.clientHeight, 2) / bodyBlock.clientHeight) + 'px';
			childrenCount = 0;
			for (let i = 0; i < bodyBlock.children.length; i++) {	
				childrenCount += bodyBlock.children[i].clientHeight;
				let style = window.getComputedStyle(bodyBlock.children[i]);
				let marginTop = style.getPropertyValue('margin-top'); 
				let marginBottom = style.getPropertyValue('margin-bottom'); 
				childrenCount += Number(marginTop.substring(0, marginTop.length - 2));
				childrenCount += Number(marginBottom.substring(0, marginBottom.length - 2));
			}
			childrenCount /= block.clientHeight;
			scrollBar.style.top = (block.scrollTop/childrenCount) + 'px'; 
		}
	}			

	scrollBar.addEventListener('mousedown',()=>{
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
			if(div)document.body.removeChild(div);
		}
	})

	let config = { attributes: true, childList: true, subtree: true};

	let callback = function(mutationsList, observer) {
	    for(let mutation of mutationsList) {
            scrollBar.style.height = (Math.pow(block.clientHeight, 2) / bodyBlock.clientHeight) + 'px';
            scrollBar.style.top = (block.scrollTop/childrenCount) + 'px';
            if(bodyBlock.clientHeight < block.clientHeight) scrollBar.style.display = 'none'
			else scrollBar.style.display = 'block';
	    }
	};

	let observer = new MutationObserver(callback);

	observer.observe(bodyBlock, config);

}
