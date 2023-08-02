export default class PaigePost extends HTMLElement {
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

        div.column {
          display: flex;
          flex-direction: column;
        }

        div.row {
          display: flex;
          flex-direction: row;
        }

        p {
          margin: 0;
          padding: 0;
        }

        #author {
          color: #000000;
          font-size: 16px;
          font-weight: 600;
          padding: 0 4px 0 16px;       
        }

        #avatar {
          border-radius: 40px;
          height: 40px;
          object-fit: cover;   
          width: 40px;
        }

        #controls {
          padding: 8px 0 0 0;
          width: 480px;
        }

        #controls button {
          align-items: center;
          appearance: none;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          height: 40px;
          justify-content: center;
          width: 40px;
        }

        #controls button img {        
          height: 28px;
          width: 28px;
        }

        #description {
          line-height: 20px;
          padding: 8px 0 0 0;
          width: 480px;
        }

        #description span:first-of-type {
          font-weight: 600;
        }

        #image {
          border-radius: 8px;
          height: 480px;
          object-fit: cover;
          margin: 16px 0 0 0;
          width: 480px;
        }

        #likes {
          font-weight: 600;
          padding: 8px 0 0 0;
        }

        #location {
          font-size: 16px;
          padding: 4px 0 0 16px;
        }

        #posted {
          color: #737373;
          font-size: 16px;
          padding: 0 0 0 4px;
        }
      </style>
      <div class="row" style="align-items: center;">
        <img id="avatar" />
        <div class="column">
          <div class="row">
            <p><span id="author"></span>&#9679;<span id="posted">5d</span></p>
          </div>
          <p id="location"></p>
        </div>
      </div>
      <img id="image" />
      <div id="controls" class="row">
        <button>
          <img src="heart.svg" />
        </button>
        <button>
          <img src="comment.svg" />        
        </button>
        <button>
          <img src="send.svg" />                
        </button>
        <div style="flex-basis: 0; flex-grow: 1;"></div>
        <button>
          <img src="bookmark.svg" />                        
        </button>                        
      </div>
      <p id="likes"><span></span> likes</p>
      <p id="description"><span></span> <span></span></p>
      <div>
        <p>View all <span>2</span> comments</p>
      </div>
      <div>
        <input placeholder="Add a comment..." />
      </div>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$author = this.shadowRoot.querySelector( '#author' );
    this.$avatar = this.shadowRoot.querySelector( '#avatar' );
    this.$description = this.shadowRoot.querySelector( '#description span:last-of-type' );
    this.$description_author = this.shadowRoot.querySelector( '#description span:first-of-type' );
    this.$image = this.shadowRoot.querySelector( '#image' );
    this.$likes = this.shadowRoot.querySelector( '#likes span' );
    this.$location = this.shadowRoot.querySelector( '#location' );    
  }

  // When things change
  _render() {
    this.$author.innerText = this.author === null ? '' : this.author;
    this.$description.innerText = this.description === null ? '' : this.description;
    this.$description_author.innerText = this.author === null ? '' : this.author;
    this.$avatar.src = this.avatar === null ? '' : this.avatar;
    this.$image.src = this.image === null ? '' : this.image;
    this.$likes.innerText = this.likes === null ? '0' : this.likes;    
    this.$location.innerText = this.location === null ? '' : this.location;    
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
    this._upgrade( 'author' );        
    this._upgrade( 'avatar' );    
    this._upgrade( 'concealed' );
    this._upgrade( 'data' );
    this._upgrade( 'description' );
    this._upgrade( 'hidden' );
    this._upgrade( 'image' );    
    this._upgrade( 'likes' );        
    this._upgrade( 'location' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'author',
      'avatar',
      'concealed',
      'description',
      'hidden',
      'image',
      'likes',
      'location'
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
  get author() {
    if( this.hasAttribute( 'author' ) ) {
      return this.getAttribute( 'author' );
    }

    return null;
  }

  set author( value ) {
    if( value !== null ) {
      this.setAttribute( 'author', value );
    } else {
      this.removeAttribute( 'author' );
    }
  }  

  get avatar() {
    if( this.hasAttribute( 'avatar' ) ) {
      return this.getAttribute( 'avatar' );
    }

    return null;
  }

  set avatar( value ) {
    if( value !== null ) {
      this.setAttribute( 'avatar', value );
    } else {
      this.removeAttribute( 'avatar' );
    }
  }  

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

  get description() {
    if( this.hasAttribute( 'description' ) ) {
      return this.getAttribute( 'description' );
    }

    return null;
  }

  set description( value ) {
    if( value !== null ) {
      this.setAttribute( 'description', value );
    } else {
      this.removeAttribute( 'description' );
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

  get image() {
    if( this.hasAttribute( 'image' ) ) {
      return this.getAttribute( 'image' );
    }

    return null;
  }

  set image( value ) {
    if( value !== null ) {
      this.setAttribute( 'image', value );
    } else {
      this.removeAttribute( 'image' );
    }
  }   

  get likes() {
    if( this.hasAttribute( 'likes' ) ) {
      return parseInt( this.getAttribute( 'likes' ) );
    }

    return null;
  }

  set likes( value ) {
    if( value !== null ) {
      this.setAttribute( 'likes', value );
    } else {
      this.removeAttribute( 'likes' );
    }
  }  
  
  get location() {
    if( this.hasAttribute( 'location' ) ) {
      return this.getAttribute( 'location' );
    }

    return null;
  }

  set location( value ) {
    if( value !== null ) {
      this.setAttribute( 'location', value );
    } else {
      this.removeAttribute( 'location' );
    }
  }     
}

window.customElements.define( 'plh-post', PaigePost );
