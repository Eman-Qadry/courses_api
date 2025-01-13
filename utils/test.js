app.get('/test', async (req, res) => {
    try {
        const testConnection = await mongoose.connection.readyState;
        res.send({ status: testConnection === 1 ? 'Connected' : 'Disconnected' });
    } catch (err) {
        res.status(500).send('Database connection error');
    }
});
