<template>
    <div class="loading-container">
        <span class="spinner"></span>
    </div>
</template>
<style scoped lang="scss">
    .loading-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100dvw;
        height: 100dvh;
        background-color: color(greyscale, 100);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99;
    }
    .spinner {
        width: 24px;
        height: 24px;
        display: grid;
        border-radius: 50%;
        -webkit-mask: radial-gradient(farthest-side,#0000 40%,#000000 41%);
        background: linear-gradient(0deg ,rgba(0,0,0,0.5) 50%,rgba(0,0,0,1) 0) center/1.9px 100%,
                linear-gradient(90deg,rgba(0,0,0,0.25) 50%,rgba(0,0,0,0.75) 0) center/100% 1.9px;
        background-repeat: no-repeat;
        animation: spinner-d3o0rx 0.8s infinite steps(12);
    }

    .spinner::before,
    .spinner::after {
    content: "";
        grid-area: 1/1;
        border-radius: 50%;
        background: inherit;
        opacity: 0.915;
        transform: rotate(30deg);
    }

    .spinner::after {
        opacity: 0.83;
        transform: rotate(60deg);
    }

    @keyframes spinner-d3o0rx {
        100% {
            transform: rotate(1turn);
        }
    }
</style>
<script setup></script>