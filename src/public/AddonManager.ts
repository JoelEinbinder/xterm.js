/**
 * Copyright (c) 2019 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import { ITerminalAddon, IDisposable, Terminal } from 'xterm';

export interface ILoadedAddon {
  instance: ITerminalAddon;
  dispose: () => void;
  isDisposed: boolean;
}

export class AddonManager implements IDisposable {
  protected _addons: ILoadedAddon[] = [];

  constructor() {
  }

  public dispose(): void {
    for (let i = this._addons.length - 1; i >= 0; i--) {
      this._addons[i].instance.dispose();
    }
  }

  public loadAddon(terminal: Terminal, instance: ITerminalAddon): void {
    const loadedAddon: ILoadedAddon = {
      instance,
      dispose: instance.dispose,
      isDisposed: false
    };
    this._addons.push(loadedAddon);
    instance.dispose = () => this._wrappedAddonDispose(loadedAddon);
    instance.activate(<any>terminal);
  }

  private _wrappedAddonDispose(loadedAddon: ILoadedAddon): void {
    if (loadedAddon.isDisposed) {
      // Do nothing if already disposed
      return;
    }
    let index = -1;
    for (let i = 0; i < this._addons.length; i++) {
      if (this._addons[i] === loadedAddon) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      throw new Error('Could not dispose an addon that has not been loaded');
    }
    loadedAddon.isDisposed = true;
    loadedAddon.dispose();
    this._addons.splice(index, 1);
  }
}
