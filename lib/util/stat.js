module.exports = doh = {};

//
// Utility Functions and Classes
//

//Statistics functions to handle computing performance metrics.
//Taken from dojox.math
//	basic statistics
doh.standardDeviation = function(/* Number[] */a){
	//	summary:
	//		Returns the standard deviation of the passed arguments.
	return Math.sqrt(this.variance(a));	//	Number
};

doh.variance = function(/* Number[] */a){
	//	summary:
	//		Find the variance in the passed array of numbers.
	var mean=0, squares=0;
	a.forEach( function(item){
		mean+=item;
		squares+=Math.pow(item,2);
	});
	return (squares/a.length)-Math.pow(mean/a.length, 2);	//	Number
};

doh.mean = function(/* Number[] */a){
	//	summary:
	//		Returns the mean value in the passed array.
	var t=0;
	a.forEach( function(v){
		t += v;
	});
	return t / Math.max(a.length, 1);	//	Number
};

doh.min = function(/* Number[] */a){
	//	summary:
	//		Returns the min value in the passed array.
	return Math.min.apply(null, a);		//	Number
};

doh.max = function(/* Number[] */a){
	//	summary:
	//		Returns the max value in the passed array.
	return Math.max.apply(null, a);		//	Number
},

doh.median= function(/* Number[] */a){
	//	summary:
	//		Returns the value closest to the middle from a sorted version of the passed array.
	return a.slice(0).sort()[Math.ceil(a.length/2)-1];	//	Number
},

doh.mode = function(/* Number[] */a){
	//	summary:
	//		Returns the mode from the passed array (number that appears the most often).
	//		This is not the most efficient method, since it requires a double scan, but
	//		is ensures accuracy.
	var o = {}, r = 0, m = Number.MIN_VALUE;
	a.forEach( function(v){
		(o[v]!==undefined)?o[v]++:o[v]=1;
	});

	//	we did the lookup map because we need the number that appears the most.
	for(var p in o){
		if(m < o[p]){
			m = o[p], r = p;
		}
	}
	return r;	//	Number
};

doh.average = function(/* Number [] */ a){
	var i;
	var s = 0;
	for(i = 0; i < a.length; i++){
		s += a[i];
	}
	return s/a.length;
}