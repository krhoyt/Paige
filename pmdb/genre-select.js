export default class GenreSelect extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          position: relative;
        }

        button.select {
          align-items: center;
          appearance: none;
          background: #ffffff;
          border: solid 1px transparent;
          border-radius: 20px;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          gap: 8px;
          height: 40px;
          margin: 0;
          min-width: 200px;
          outline: none;
          padding: 8px 12px 8px 24px;
          -webkit-tap-highlight-color: transparent;          
        }

        button.select:focus {
          border: solid 1px #f6b000;
          box-shadow: 0 0 0 3px rgb( from #f6b000 r g b / 0.40 );
        }

        button.select span {
          color: #161616;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          text-align: left;
          width: 100%;
        }

        button.select svg:last-of-type {
          display: none;
        }

        ul {
          background: #ffffff;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          list-style: none;
          margin: 0;
          max-height: 50vh;
          min-width: 200px;
          overflow: auto;
          padding: 8px 0 8px 0;
          position: absolute;
          top: 41px;
        }

        ul button {
          align-items: center;
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          height: 40px;
          line-height: 24px;
          margin: 0;
          outline: none;
          padding: 8px 12px 8px 24px;
          text-align: left;
          width: 100%;
          -webkit-tap-highlight-color: transparent;          
        }

        ul button span {
          color: #161616;
          flex-basis: 0;
          flex-grow: 1;
          text-align: left;
        }

        ul button:not( .selected ) img {
          display: none;
        }

        :host( :not( [open] ) ) ul {
          display: none;
        }

        @media( max-width: 600px ) {        
          button.select {
            background: none;
            border: solid 1px #f6b000;
            justify-content: center;
            margin: 0;
            max-width: 40px;
            min-width: 40px;            
            padding: 0;
          }

          button.select span {
            display: none;
          }

          button.select svg:first-of-type {
            display: none;
          }

          button.select svg:last-of-type {
            display: inline;
          }

          ul {
            left: -160px;
          }
        }
      </style>
      <button class="select" type="button">
        <span>Filter</span>
        <svg width="24" height="24">
          <path fill="#161616" d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062"/>
        </svg>
        <svg width="24" height="24">
          <path fill="#f6b000" d="M11 20q-.425 0-.712-.288T10 19v-6L4.2 5.6q-.375-.5-.112-1.05T5 4h14q.65 0 .913.55T19.8 5.6L14 13v6q0 .425-.288.713T13 20zm1-7.7L16.95 6h-9.9zm0 0"/>
        </svg>
      </button>
      <ul></ul>
    `;

    // Private
    this._data = [];

    // Events
    this.onItemClick = this.onItemClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$list = this.shadowRoot.querySelector( 'ul' );
    this.$select = this.shadowRoot.querySelector( 'button.select' );
    this.$select.addEventListener( 'click', () => {
      this.open = !this.open;
    } );
    this.$value = this.shadowRoot.querySelector( 'button.select span' );
  }

  onItemClick( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( this._data[index] === this.value ) {
      this.value = null;
      for( let c = 0; c < this.$list.children.length; c++ ) {
        this.$list.children[c].children[0].classList.remove( 'selected' );
      }
    } else {
      this.value = this._data[index];
      for( let c = 0; c < this.$list.children.length; c++ ) {
        if( c === index ) {
          this.$list.children[c].children[0].classList.add( 'selected' );
        } else {
          this.$list.children[c].children[0].classList.remove( 'selected' );        
        }
      }      
    }

    this.open = false;

    this.dispatchEvent( new CustomEvent( 'db-change', {
      detail: {
        value: this.value
      }
    } ) );
  }

  // When attributes change
  _render() {
    console.log( 'Filter: ' + this.value );
    this.$value.textContent = this.value === null ? 'Filter' : this.value;
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
    this._upgrade( 'data' );    
    this._upgrade( 'open' );        
    this._upgrade( 'value' );      
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'open',
      'value'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get data() {
    return this._data.length === 0 ? null : this._data;
  }
  
  set data( value ) {
    this._data = value === null ? [] : [... value];
    this._data.sort();

    while( this.$list.children.length > this._data.length ) {
      this.$list.children[0].children[0].removeEventListener( 'click', this.onItemClick );      
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._data.length ) {
      const item = document.createElement( 'li' );

      const button = document.createElement( 'button' );
      button.addEventListener( 'click', this.onItemClick );                  
      button.tabIndex = 0;
      button.type = 'button';

      const label = document.createElement( 'span' );
      button.appendChild( label );
      
      const check = document.createElement( 'img' );
      check.src = 'check.svg';
      button.appendChild( check ); 
      
      item.appendChild( button );
      this.$list.appendChild( item );
    }
    
    for( let d = 0; d < this._data.length; d++ ) {
      this.$list.children[d].children[0].setAttribute( 'data-index', d );
      this.$list.children[d].children[0].children[0].textContent = this._data[d];
    }
  }  

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get open() {
    return this.hasAttribute( 'open' );
  }

  set open( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'open' );
      } else {
        this.setAttribute( 'open', '' );
      }
    } else {
      this.removeAttribute( 'open' );
    }
  }

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( content ) {
    if( content !== null ) {
      this.setAttribute( 'value', content );
    } else {
      this.removeAttribute( 'value' );
    }
  }
}

window.customElements.define( 'db-genre-select', GenreSelect );
