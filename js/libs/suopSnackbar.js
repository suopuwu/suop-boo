class SuopSnack {
  //private
  static #initialized = false
  static #snackbars = new Map()

  static #init() {
    if (!this.#initialized) {
      //this adds the styles in so you only have to use one file for the snackbars.
      let styles = document.createElement('style')
      const css = `#mSnackbarContainer .mSnackbar .mSnackbar-action, #mSnackbarContainer .mSnackbar .mSnackbar-close-button {cursor: pointer;position: relative;}#mSnackbarContainer .mSnackbar .mSnackbar-action::after, #mSnackbarContainer .mSnackbar .mSnackbar-close-button::after {transition: all 0.2s;position: absolute;content: "";width: 100%;height: 100%;right: 0;top: 0;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);}#mSnackbarContainer .mSnackbar .mSnackbar-action:hover::after, #mSnackbarContainer .mSnackbar .mSnackbar-close-button:hover::after {background-color: #ffffff13;}#mSnackbarContainer .mSnackbar .mSnackbar-action:active::after, #mSnackbarContainer .mSnackbar .mSnackbar-close-button:active::after {background-color: #ffffff3c;}.mSnackbar-content > i {font-style: normal;}#mSnackbarContainer {display: flex;flex-flow: column nowrap;align-items: flex-end;z-index: 1000;position: fixed;right: 20px;overflow: hidden;pointer-events: none;bottom: 0;transition: transform 0.5s;font-family: sans-serif, "Roboto";}#mSnackbarContainer .snackbar-wrapper {overflow: hidden;}#mSnackbarContainer .mSnackbar {display: flex;flex-flow: row nowrap;align-items: center;pointer-events: all;line-height: 22px;padding: 14px 14px 14px 24px;background-color: #323232;color: #DEDEDE;font-size: 14px;z-index: 100;min-width: 288px;max-width: 568px;border-radius: 4px;margin-bottom: 20px;box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;transition: all 0.2s ease-in-out;}@media (orientation: portrait) {#mSnackbarContainer .mSnackbar {max-width: 100%;margin: 0;}}#mSnackbarContainer .mSnackbar .mSnackbar-close-button {height: 24px;width: 24px;margin-left: 12px;}#mSnackbarContainer .mSnackbar .mSnackbar-close-button::after {border-radius: 100%;width: 40px;height: 40px;}#mSnackbarContainer .mSnackbar .mSnackbar-action {margin: 0 7.5px 0 11.5px;font-weight: bold;}#mSnackbarContainer .mSnackbar .mSnackbar-action::after {width: calc(100% + 15px);height: calc(100% + 15px);border-radius: 4px;}#mSnackbarContainer .mSnackbar span:first-of-type {margin: 0 7.5px 0 19.5px;}#mSnackbarContainer .mSnackbar .mSnackbar-flex-grow-spacer {flex-grow: 1;}@media (orientation: portrait) {#mSnackbarContainer {right: 0;}}.no-transition {transition: none !important;}`
      styles.textContent = css
      document.querySelector('body').append(styles)
      //returns a value that increases by one each time the function is called.
      let snackbarContainer
      snackbarContainer = document.createElement('div')
      snackbarContainer.id = 'mSnackbarContainer'
      document.querySelector('body').append(snackbarContainer)
      this.#initialized = true
    }
  }

  static #Snackbar = class SuopSnackbar {
    static snackbarContainer
    static _iterator = 0
    static get iterator() {
      this._iterator++
      return this._iterator - 1
    }
    actions
    constructor(
      text = '',
      lifespan = 3000,
      actionsList = [],
      noCloseButton = false
    ) {
      actionsList = actionsList ?? []

      this.actions = new Map()
      for (let action of actionsList) {
        this.actions.set(action.text, action)
      }
      this.snackbarContainer = document.getElementById('mSnackbarContainer')
      this._text = text
      this.lifespan = lifespan
      this.noCloseButton = noCloseButton

      if (!lifespan) {
        this.lifespan = 3000
      }
      //iterator ensures that all ids are (probably) unique
      this.id = 'mSnackbar' + this.constructor.iterator

      //todo add option for bottom offset to make the snackbar not cover important ui.
      //adds the new snackbar to the dom.
      this.node = document.createElement('span')
      this.node.id = this.id
      this.node.classList.add('snackbar-wrapper')
      this.snackbarContainer.append(this.node)
      this.node.innerHTML = `
        <div class="mSnackbar">
          <div class="mSnackbar-content">
            ${text}
          </div>
          <div class="mSnackbar-flex-grow-spacer"></div>
          <span class="snackbar-actions"></span>
          ${
            !this.noCloseButton
              ? `
          <span class="mSnackbar-close-button"><svg height="24px" viewBox="0 0 24 24" width="24px" fill="#DEDEDE"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></span>
          `
              : ''
          }
        </div>
        `

      this.renderActions()
      this.node.onclick = (e) => {
        if (e.target.classList.contains('mSnackbar-close-button')) this.close()
      }

      if (this.lifespan !== Infinity) {
        this.timeout = setTimeout(() => this.close(), this.lifespan)
      }
    }

    renderActions() {
      const actionsContainer = this.node.querySelector('.snackbar-actions')
      actionsContainer.innerHTML = ''
      for (let [key, action] of this.actions) {
        let actionNode = document.createElement('span')
        actionNode.onclick = action.onClick
        let actionId = 'snackbar-action-' + SuopSnackbar.iterator
        actionNode.innerHTML = `
                      <style> 
                        #${actionId} {
                          color: ${action.color}
                        }
                        #${actionId}:hover::after {
                          background-color: ${action.color}13 !important;
                        }
                        #${actionId}:active::after {
                          background-color: ${action.color}3c !important;
              
                        }
                        </style>
                      <span class="mSnackbar-action" id="${actionId}">${action.text}</span>
                      `
        actionsContainer.append(actionNode)
      }
    }

    setAction(action) {
      this.actions.set(action.text, action)
      this.renderActions()
    }

    removeAction(actionText) {
      this.actions.delete(actionText)
      this.renderActions()
    }

    close(delay = 0) {
      if (delay !== 0) {
        setTimeout(() => {
          this.close()
        }, delay)
        return
      }
      //clears the existing timer as it is no longer needed and causes ui issues.
      let timeoutToClear = this.timeout
      clearTimeout(timeoutToClear)

      //if there are multiple snackbars currently, fade the closed snackbar out then animate its height to zero.
      if (SuopSnack.snackbars.size > 1) {
        this.node.animate(
          [
            {
              opacity: 1,
              height: this.node.getBoundingClientRect().height + 'px',
            },
            {
              opacity: 0,
              height: this.node.getBoundingClientRect().height + 'px',
            },
            {
              opacity: 0,
              height: 0,
            },
          ],
          {
            duration: 400,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
            fill: 'forwards',
          }
        )
        setTimeout(() => this.node.remove(), 400)
        SuopSnack.snackbars.delete(this.id)
      } else {
        //if there is only one snackbar, make it fall off the screen.
        this.node.animate(
          [
            {
              translate: '0 0',
            },
            {
              translate: '0 ' + this.node.getBoundingClientRect().height + 'px',
            },
          ],
          {
            duration: 200,
            easing: 'ease-in',
            fill: 'forwards',
          }
        )
        setTimeout(() => this.node.remove(), 400)
        SuopSnack.snackbars.delete(this.id)
      }
    }
    get text() {
      return this._text
    }
    set text(newText) {
      this._text = newText
      this.node.querySelector('.mSnackbar-content').innerHTML = newText
    }
  }

  //public

  static add(text, lifespan, actions, noCloseButton) {
    this.#init()
    let container = document.getElementById('mSnackbarContainer')
    let newSnackbar = new SuopSnack.#Snackbar(
      text,
      lifespan,
      actions,
      noCloseButton
    )
    this.#snackbars.set(newSnackbar.id, newSnackbar)
    //animates the snackbar container to reveal the new snackbar.
    container.animate(
      [
        {
          translate: '0 ' + newSnackbar.node.clientHeight + 'px',
        },
        {
          translate: '0 0',
        },
      ],
      {
        duration: 200,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        fill: 'forwards',
      }
    )

    //returns the newly added snackbar so the developer can call close() like so:
    //let example = $.mSnackbar.add();
    //example.close();
    return this.#snackbars.get(newSnackbar.id)
  }
  static Action = class {
    text //must be unique per snackbar
    color
    onClick
    constructor(
      text = 'action',
      onClick = function () {
        console.log('action presed, make sure to add something here')
      },
      color = '#F44336'
    ) {
      this.text = text
      this.color = color
      this.onClick = onClick
    }
  }

  static get snackbars() {
    return this.#snackbars
  }
}
