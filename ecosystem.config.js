module.exports = {
	apps: [{
		name: 'Spartan Manufacturing',
		script: './index.js'
		}],
	deploy: {
		production: {
			user: 'ubuntu',
			host: '13.58.161.45',
			key: '~/.ssh/MainServerKey.pem',
			ref: 'origin/master',
			repo: 'git@github.com:JoeHolt/Spartan-Manufacturing-Web.git',
			path: '/home/ubuntu/SpartanMan',
			'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
		}
	}
}
