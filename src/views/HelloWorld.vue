<template>
    <div class="post">
        <div v-if="loading" class="loading">
            Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationvue">https://aka.ms/jspsintegrationvue</a> for more details.
        </div>

        <div v-if="post" class="content">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>name</th>
                        <th>dept_Name</th>
                        <th>salary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(forecast,index) in post" :key="index">
                        <td>{{ forecast.id }}</td>
                        <td>{{ forecast.name }}</td>
                        <td>{{ forecast.dept_Name }}</td>
                        <td>{{ forecast.salary }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="js">
    import { ref } from 'vue';
    const loading = ref(true);
    const post = ref(null);
    
    const fetchData=()=>{
        fetch('weatherforecast')
            .then(r => r.json())
            .then(json => {
                post.value = json;
                loading.value = false;
                return;
            });
    }
    fetchData();
</script>