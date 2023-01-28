<form>
    <input type="radio" name="piece" value="i-piece" checked />
    <input type="radio" name="piece" value="j-piece" />
    <input type="radio" name="piece" value="l-piece" />
    <input type="radio" name="piece" value="o-piece" />
    <input type="radio" name="piece" value="s-piece" />
    <input type="radio" name="piece" value="t-piece" />
    <input type="radio" name="piece" value="z-piece" />
</form>

<style>
    form {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #000000be;
        box-shadow: 0 0 12px #000000aa;
        box-sizing: border-box;
        padding: 16px;
        gap: 16px;
    }

    input {
        position: relative;
        appearance: none;
        cursor: pointer;
        width: 56px;
        height: 56px;
        border: 3px solid white;
        border-right-style: dashed;
        border-bottom-style: dashed;
        margin: 0;
    }

    input::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: var(--icon);
        background-size: contain;
        background-repeat: no-repeat;
    }

    input:hover,
    input:checked {
        background-color: var(--color);
    }

    input[value="i-piece"] {
        --icon: url("assets/i-piece-icon.svg");
        --color: #00ffff50;
    }

    input[value="j-piece"] {
        --icon: url("assets/j-piece-icon.svg");
        --color: #0000ff50;
    }

    input[value="l-piece"] {
        --icon: url("assets/l-piece-icon.svg");
        --color: #ffa50050;
    }

    input[value="o-piece"] {
        --icon: url("assets/o-piece-icon.svg");
        --color: #ffff0050;
    }

    input[value="s-piece"] {
        --icon: url("assets/s-piece-icon.svg");
        --color: #00ff0050;
    }

    input[value="t-piece"] {
        --icon: url("assets/t-piece-icon.svg");
        --color: #80008050;
    }

    input[value="z-piece"] {
        --icon: url("assets/z-piece-icon.svg");
        --color: #ff000050;
    }
</style>
