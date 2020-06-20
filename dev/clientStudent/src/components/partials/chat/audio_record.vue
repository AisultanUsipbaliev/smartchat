<template>
	<div>
		  <svg width="30" height="30">
		    <polygon :points="points"></polygon>
		    <circle cx="15" cy="15" r="15"></circle>
		  </svg>
	</div>
</template>
<script>
	export default{
		name: 'AudioRecord',
	  data(){
	  	var min = 300;
	  	var stats = Array.apply(null, { length: min })
	    	.map(function () { return 100 })
	  	return {
	    	stats: stats,
	    	points: generatePoints(stats),
	      sides: min,
	      minRadius: 55,
	      maxRadius: 100,
	      interval: null,
	      updateInterval: 125,
	      input: null,
	    }
	  },
	  computed: {
	    getAud() {
	      return this.$store.getters['socketMessage/AUDIO'];
	    },
	  },
	  watch: {
	  	getAud(newData) {
	  		if(this.input != newData.audio.audio){
		  		this.input = newData.audio.audio;
		  		this.minRadius = this.input / 50;
		  		this.maxRadius = this.input / 2.5;
		  		this.sides = this.input;
		  		if(this.sides < 80) this.sides = 80;
		  		if(this.sides > 150) this.sides = 150;
		  	}
	  	},
	  	sides: function (newSides, oldSides) {
	    	var sidesDifference = newSides - oldSides
	      if (sidesDifference > 0) {
	      	for (var i = 1; i <= sidesDifference; i++) {
	        	this.stats.push(this.newRandomValue())
	        }
	      } else {
	        var absoluteSidesDifference = Math.abs(sidesDifference)
	      	for (var i = 1; i <= absoluteSidesDifference; i++) {
	        	this.stats.shift()
	        }
	      }
	    },
	    stats: function (newStats) {
				TweenLite.to(
	      	this.$data, 
	        this.updateInterval / 1000, 
	        { points: generatePoints(newStats) }
	    	)
	    },
	    updateInterval: function () {
	    	this.resetInterval()
	    }
	  },
	  mounted: function () {
	  	this.resetInterval()
	  },
	  methods: {
	    randomizeStats: function () {
	    	var vm = this
	    	this.stats = this.stats.map(function () {
	      	return vm.newRandomValue()
	      })
	    },
	    newRandomValue: function () {
	    	return Math.ceil(this.minRadius + Math.random() * (this.maxRadius - this.minRadius))
	    },
	    resetInterval: function () {
	    	var vm = this
	    	clearInterval(this.interval)
	      this.randomizeStats()
	    	this.interval = setInterval(function () { 
	      	vm.randomizeStats()
	      }, this.updateInterval)
	    }
	  }
	}

function valueToPoint (value, index, total) {
  var x     = 0
  var y     = -value/ 7
  var angle = Math.PI * 2 / total * index
  var cos   = Math.cos(angle)
  var sin   = Math.sin(angle)
  var tx    = x * cos - y * sin + 15
  var ty    = x * sin + y * cos + 15
  return { x: tx, y: ty }
}

function generatePoints (stats) {
	var total = stats.length
	return stats.map(function (stat, index) {
    var point = valueToPoint(stat, index, total)
    return point.x + ',' + point.y
  }).join(' ')
}


</script>

<style scoped>
	svg{
		display: flex; 
		justify-content: center;
		align-items: center;
	}
	polygon{ 
		fill: #1e83d4;
		z-index: 10;
	}
	circle {
	  fill: transparent;
	  stroke: #1e83d4;
	}
	circle.inner {
	  fill: #f00;
	  stroke: transparent;
	}
	input[type="range"] {
	  display: block;
	  width: 100%;
	  margin-bottom: 15px;
	}

</style>