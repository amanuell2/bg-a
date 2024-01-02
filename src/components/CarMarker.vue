<template>
    <div>
        <img v-if="color === 'red'" src="@/assets/images/car-red.png"/>
        <img v-else-if="color === 'blue'" src="@/assets/images/car-blue.png"/>
        <img v-else-if="color === 'green'" src="@/assets/images/car-green.png"/>
        <div v-else>.</div>
    </div>
</template>
<script>
export default {
    props: ["color"]    
}
</script>