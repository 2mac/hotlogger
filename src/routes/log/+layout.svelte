<header>
    <img src="hotlogger-main-long.png" alt="Hot Logger">
</header>

<main>
    <slot />
</main>

<style>

    img {
        height: 10vh;
        min-height: 40px;
    }

    em {
        color: firebrick;
    }

    header {
        border-bottom: thin solid;
        margin-bottom: 1em;
        display:flex; 
        justify-content: center;
    }
</style>