import PaigeDigit from "./digit.js";

export default class PaigeCountdown extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #000000;
          border-radius: 12px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          padding: 28px 28px 24px 28px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        div {
          display: flex;
          flex-direction: row;
        }

        p {
          color: #ffffff;
          font-family: sans-serif;
          font-size: 16px;
          margin: 0 0 12px 0;
          padding: 0;
          text-rendering: optimizeLegibility;
          text-transform: uppercase;
        }

        p.colon {
          font-size: 24px;
          padding: 12px 4px 8px 4px;
        }

        :host( :not( [label] ) ) p:not( .colon ) {
          display: none;
        }
      </style>
      <p></p>
      <div>
        <plh-digit label="days"></plh-digit>
        <p class="colon">:</p>
        <plh-digit label="hours"></plh-digit>
        <p class="colon">:</p>      
        <plh-digit label="minutes"></plh-digit>
      </div>
    `;

    // Private
    this._data = null;
    this._interval = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$days = this.shadowRoot.querySelector( 'plh-digit:nth-of-type( 1 )' );
    this.$hours = this.shadowRoot.querySelector( 'plh-digit:nth-of-type( 2 )' );    
    this.$label = this.shadowRoot.querySelector( 'p:not( .colon )' );
    this.$minutes = this.shadowRoot.querySelector( 'plh-digit:nth-of-type( 3 )' );        
  }

  start() {
    this._interval = setInterval( this._render(), 1000 );
  }

  stop() {
    clearInterval( this._interval );
    this._interval = null;
  }

  // When things change
  _render() {
    this.$label.innerText = this.label === null ? '' : this.label;

    if( this.endDate !== null ) {
      // https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates
      let delta = Math.abs( this.endDate - Date.now() ) / 1000;

      const days = Math.floor( delta / 86400 );
      delta -= days * 86400;

      const hours = Math.floor( delta / 3600 ) % 24;
      delta -= hours * 3600;

      const minutes = Math.floor( delta / 60 ) % 60;

      this.$days.value = days;
      this.$hours.value = hours;
      this.$minutes.value = minutes + 1;
    }
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'concealed' );
    this._upgrade( 'data' );
    this._upgrade( 'endDate' );        
    this._upgrade( 'hidden' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'end-date'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }

  get endDate() {
    if( this.hasAttribute( 'end-date' ) ) {
      return parseInt( this.getAttribute( 'end-date' ) );
    }

    return null;
  }

  set endDate( value ) {
    if( value !== null ) {
      this.setAttribute( 'end-date', value );
    } else {
      this.removeAttribute( 'end-date' );
    }
  }     

  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }    
}

window.customElements.define( 'plh-countdown', PaigeCountdown );
