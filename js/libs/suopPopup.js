//Options are passed in an object like so:
//{
//    deleteOnClose: true,
//    background: '#000000',    <string?>
//    confirm: null,     <function?>
//    cancel: null,     <function?>
//}
//You only have to fill out options that you use
class SuopPopup {
    static #globalLevel = 100
    static get zIndex() {
        this.#globalLevel++
        return this.#globalLevel
    }
    #visible = false
    #options
    level
    id
    _content
    node
    contentNode

    get content() {
        return this._content
    }
    set content(newContent) {
        this.contentNode.innerHTML = newContent
        this._content = newContent
    }

    #createActions() {
        var container = document.createElement('div')
        container.classList.add('suop-popup-actions')
        document
            .getElementById(this.id)
            .querySelector('.suop-popup-wrapper')
            .append(container)
        function createAction(iconHtml, callback) {
            var button = document.createElement('span')
            button.innerHTML = iconHtml
            button.classList.add('suop-popup-button')
            button.onclick = callback
            container.append(button)
        }
        if (this.#options.cancel) {
            createAction(
                '<svg viewBox="0 -960 960 960" width="50" fill="#3e3e3e"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>',
                this.#options.cancel
            )
        }
        if (this.#options.confirm) {
            createAction(
                '<svg viewBox="0 -960 960 960" width="50" fill="#3e3e3e"><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/></svg>',
                this.#options.confirm
            )
        }
    }

    createPopupElement() {
        this.node = document.createElement('div')
        this.node.id = this.id
        this.node.classList.add('intangible')
        this.node.classList.add('invisible')
        this.node.innerHTML = `
			<style>
			.invisible {
				opacity: 0;
			}

			.intangible {
				display: none !important;
			}
			#${this.id} {
        ${
            !this.#options.floating
                ? `
        position: fixed;
				background-color: rgba(0, 0, 0, 0.8);
				width: 100%;
				height: 100%;
				top: 0;
                padding: 10vh 0 10vh 0;
        left: 0;
				cursor: pointer;
        display: flex;
				justify-content: center;
				align-items: baseline;
                overflow-y: scroll;
                scrollbar-width: none;
                box-sizing: border-box;
        `
                : `
        position: absolute;
        display: inline;
            `
        }
				transition: 0.2s all;
        z-index: ${this.level}
			}

            #${this.id}::-webkit-scrollbar {
                display: none;
            }

      .suop-popup-close-button {
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        line-height: 0;
        pointer-events: none;
      }

      #${this.id} .suop-popup-wrapper {
        margin: auto;
        cursor: auto;
        box-shadow: ${this.#options.shadow ?? 'none'};
        @media(orientation: landscape) {
          max-width: 80vw;
        }
        position: relative;
        top: ${this.#options.y}px;
        left: ${this.#options.x}px;
      }

      .suop-popup-background {
        background-color: ${this.#options.background};
        padding: ${this.#options.padding}px;
        border-radius: ${this.#options.borderRadius}px;
        line-height: 0;
        display: flex;
        flex-flow: column;
      }

      .suop-popup-content {
        line-height: normal
        
      }

      .suop-popup-actions {
          text-align: right;
      }

      .suop-popup-button {
        line-height: 0;
        display: inline-block;
      }
      
      .suop-popup-button > svg {
        margin: 5px;
        padding: 5px;
        width: 2em;
        line-height: 0;
        cursor: pointer;
        border-radius: 100%;
        transition: box-shadow 0.2s;
        box-shadow: inset 0 0 0 9999px rgba(0,0,0,0)
      }
      
      .suop-popup-button > svg:hover {
        box-shadow: inset 0 0 0 9999px rgba(0,0,0,.1)
      }

      .suop-popup-button > svg:active {
        box-shadow: inset 0 0 0 9999px rgba(0,0,0,0.3)
      }

			</style>
      ${
          !this.#options.floating
              ? `
        <svg class="suop-popup-close-button" width="50" viewBox="0 0 24 24" fill="#aeaeae"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
      `
              : ''
      }
      
			<div class="${
                this.#options.background != null ? 'suop-popup-background' : ''
            } suop-popup-wrapper">
        <div class="suop-popup-content">${this.content}</div>
      </div>
	    `
        this.node.lastMouseDownTarget = this.node
        this.node.addEventListener('mousedown', (e) => {
            this.node.lastMouseDownTarget = e.target
        })
        this.node.addEventListener('mouseup', (e) => {
            if (
                e.target.id == this.id &&
                e.target.id == this.node.lastMouseDownTarget.id
            ) {
                if (this.#options.floating) {
                    return
                }
                if (this.#options.deleteOnClose) {
                    this.hideThenDelete()
                } else {
                    this.killPopup()
                }
            }
        })
        return this.node
    }

    #fillOptions() {
        const defaultOptions = {
            deleteOnClose: true,
            background: null,
            confirm: null,
            cancel: null,
            borderRadius: 10,
            padding: 10,
            floating: false,
            x: null,
            y: null,
            shadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
        }
        for (let key of Object.keys(defaultOptions)) {
            if (this.#options[key] === undefined) {
                this.#options[key] = defaultOptions[key]
            }
        }
    }

    constructor(content = '', options = {}) {
        this.#options = options
        this.#fillOptions()
        this.level = SuopPopup.zIndex
        this.id = 'suop-popup' + this.level
        this._content = content
        var body = document.querySelector('body')

        body.prepend(this.createPopupElement())
        this.contentNode = this.node.querySelector('.suop-popup-content')
        this.#createActions()
    }

    toggle() {
        if (this.#visible) {
            this.hidePopup()
        } else {
            this.showPopup()
        }
    }

    showPopup() {
        this.#visible = true
        var popup = document.getElementById(this.id)
        popup.classList.remove('intangible')
        setTimeout(function () {
            popup.classList.remove('invisible')
        }, 1)
    }

    hidePopup() {
        var popup = document.getElementById(this.id)

        this.#visible = false
        popup.classList.add('invisible')
        setTimeout(function () {
            popup.classList.add('intangible')
        }, 200)
    }

    remove(delay) {
        var popup = document.getElementById(this.id)
        setTimeout(() => popup.remove(), delay)
    }

    hideThenDelete() {
        this.hidePopup()
        this.remove(200)
    }
}
