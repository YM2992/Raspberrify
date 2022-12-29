const fs = require('fs');


const Configurations = {
    path: './config.json',
    data: {
        ACCESS_TOKEN: null,
        REFRESH_TOKEN: null,
        TOKEN_EXPIRY: 0,

        SETTINGS: {
            spotify_ping_interval: 1000,
            server_ping_interval: 250,
            debug_mode: false
        }
    },
    
    init() {
        if (!this.exists) {
            // Create config file if non-existent
            this.write();
        } else {
            // Adjust stored data to follow default fields
            let data = this.read();
            for (const [key, value] of Object.entries(data)) {
                if (this.data.hasOwnProperty(key)) {
                    continue;
                }
                // Delete redundant keys from stored data
                delete data[key];
            }
            
            this.data = data;
            this.write();
        }
    },

    get exists() {
        return fs.existsSync(this.path);
    },

    read() {
        try {
            const data = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            return data;
        } catch (error) {
            console.log(error);
        }
    },

    write() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
        } catch (error) {
            console.log(error);
        }
    },

    set(data={}) {
        for (const [key, value] of Object.entries(data)) {
            this.data[key] = value;
        }
        this.write();
    }
}

module.exports = Configurations;