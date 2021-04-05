<template>
  
</template>

<script>
export default {
    methods: {
        goSwagger() {
            window.location.href = 'http://localhost:8081/doc.html'; 
        }
    },
    created() {
        this.goSwagger();
    }
}
</script>

<style>

</style> 