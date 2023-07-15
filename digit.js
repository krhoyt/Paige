export default class PaigeDigit extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
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
          gap: 4px;
        }

        p {
          font-family: sans-serif;
          text-rendering: optimizeLegibility;
        }

        p:not( .digit ) {
          color: #ffffff;
          font-size: 16px;
          margin: 0;
          padding: 8px 0 0 0;
          text-transform: lowercase;
        }

        p.digit {
          background-color: #ffffff;
          border-radius: 6px;
          font-size: 24px;
          margin: 0;
          padding: 12px 10px 8px 10px;
        }

        :host( :not( [label] ) p:nth-of-type( 3 ) {
          display: none;
        }
      </style>
      <div>
        <p class="digit"></p>
        <p class="digit"></p>        
      </div>
      <p></p>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'p:not( .digit )' );
    this.$one = this.shadowRoot.querySelector( 'p:nth-of-type( 1 )' );
    this.$two = this.shadowRoot.querySelector( 'p:nth-of-type( 2 )' );    
  }

  // When things change
  _render() {
    let value = '00';

    if( this.value !== null ) {
      value = this.value.trim().length < 2 ? this.value.trim().padStart( 2, '0' ) : this.value.trim();
    }

    this.$one.innerText = value.charAt( 0 );
    this.$two.innerText = value.charAt( 1 );

    this.$label.innerText = this.label === null ? '' : this.label;
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
    this._upgrade( 'hidden' );
    this._upgrade( 'label' );    
    this._upgrade( 'value' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'label',
      'value'
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

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( value ) {
    if( value !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }      
}

window.customElements.define( 'plh-digit', PaigeDigit );
