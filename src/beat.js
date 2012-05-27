(function() {
  var Beat = function ( dancer, options ) {
    options = options || {};
    this.dancer    = dancer;
    this.frequency = options.frequency || [ 0, 10 ];
    this.threshold = options.threshold || 0.3;
    this.decay     = options.decay     || 0.02;
    this.onBeat    = options.onBeat;
    this.offBeat   = options.offBeat;
    this.isOn      = false;
    this.currentThreshold = this.threshold;

    var _this = this;
    this.dancer.bind( 'update', function() {
      if ( !_this.isOn ) { return; }
      var magnitude = _this.maxAmplitude( _this.frequency );
      if ( magnitude >= _this.currentThreshold &&
          magnitude >= _this.threshold ) {
        _this.currentThreshold = magnitude;
        _this.onBeat && _this.onBeat.call( _this.dancer, magnitude );
      } else {
        _this.offBeat && _this.offBeat.call( _this.dancer, magnitude );
        _this.currentThreshold -= _this.decay;
      }
    });
  };

  Beat.prototype = {
    on  : function () { this.isOn = true; },
    off : function () { this.isOn = false; },
    maxAmplitude : function ( frequency ) {
      var
        max = 0,
        fft = this.dancer.getSpectrum();

      // Sloppy array check
      if ( !frequency.length ) {
        return frequency < fft.length ?
          fft[ ~~frequency ] :
          null;
      }

      for ( var i = frequency[ 0 ], l = frequency[ 1 ]; i <= l; i++ ) {
        if ( fft[ i ] > max ) { max = fft[ i ]; }
      }
      return max;
    }
  };

  window.Dancer.Beat = Beat;
})();