let BASE_URL = '';

if (process.env.NODE_ENV === 'development') {
    BASE_URL = 'https://localhost:8080/';
} else if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://a9ccf582-e1ef-4d00-891a-4e40f24c2459.mock.pstmn.io';
} else {
    BASE_URL = 'https://a9ccf582-e1ef-4d00-891a-4e40f24c2459.mock.pstmn.io';
}

module.exports = { BASE_URL };
 