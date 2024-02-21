<header>
    <img src="/hotlogger-main-long.png" alt="Hot Logger">
</header>

<main>
    <slot />
</main>

<style>
    img {
        width:90vw;
        max-height: 100px;
        max-width: 500px;
    }

    header {
        margin-bottom: 1em;
        display:flex; 
        justify-content: center;
    }
</style>