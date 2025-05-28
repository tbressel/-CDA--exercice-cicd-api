const express = require('express');
const mysql2 = require('mysql2');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('OK');
    return;
});

app.get('/utilisateurs', (req, res) => {
    const pool = mysql2.createPool({
        host: 'mysql-server',
        user: 'zisquier',
        password: '[2@eYzJgV*VsvdZB',
        database: 'mydatabase'
    });

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion au pool MySQL :', err.message);
            process.exit(1);
        }
        console.log('Connecté au pool MySQL');
        connection.release();
    });

    const query = 'SELECT * FROM utilisateur';

    pool.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err.message);
            res.status(500).send('Erreur serveur');
            return;
        }
        res.json(results);
    });
});

// Ne démarre le serveur que si le fichier est exécuté directement
if (require.main === module) {
    app.listen(PORT, () => {
        console.log('Serveur on fire ! ici -> ', PORT);
    });
}

module.exports = app;