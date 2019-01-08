export default () => {
    const dbName = localStorage.getItem('dbname');

    return {
        headers: {
            'Authorization': 'bearer ' + dbName,
        }
    }
}