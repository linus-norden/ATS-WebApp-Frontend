<template>
    <main>
        <slot></slot>
    </main>
</template>

<style>
.container {
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
    max-width: 1200px;
    text-align: center;
    font-family: 'Arial', sans-serif;
    color: #333;
}

.navbar {
    max-width: 1200px;
    margin-top: 20px;
}

.nav-list {
    list-style-type: none;
    padding: 0;
    display: flex;
    justify-content: space-around;
    background-color: rgb(0, 60, 160);
    border-radius: 5px;
}

.nav-item {
    padding: 10px 20px;
}

.nav-item a {
    color: white;
    text-decoration: none;
    font-family: 'Arial', sans-serif;
    font-weight: bold;
}

.nav-item a:hover {
    text-decoration: underline;
    color: #FFD700;
}

.active-link {
    background-color: rgb(160, 190, 220);
    border-radius: 5px;
    padding: 10px 20px;
}

.table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
}

.table {
    width: 100%;
    max-width: 1000px;
    border-collapse: collapse;
}

.table th,
.table td {
    border: 1px solid rgb(0, 60, 160);
    padding: 10px;
    text-align: left;
    width: fit-content;
}

.table th {
    background-color: rgb(160, 190, 220);
}

.table tbody tr:nth-child(even) {
    background-color: #f2f2f2;
}
</style>
