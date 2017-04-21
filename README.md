# fetch

[![Remix on Glitch](https://img.shields.io/badge/Remix%20On%20Glitch-fetch-blue.svg)](https://glitch.com/~fetch)

Private maven servers are complicated or pricey. fetch aims to make them simple and relatively free by storing artifacts on [Dropbox](https://www.dropbox.com/). All you need to do is remix this project on glitch.com and do a bit of configuration.

## Setup
1. [Remix](https://glitch.com/~fetch) this project on Glitch.com
2. Add your desired password and your [Dropbox access token](https://blogs.dropbox.com/developers/2014/05/generate-an-access-token-for-your-own-account/) to the `.env` file in Glitch. It'll look a little something like this:
```
# Environment Config

# store your secrets and config variables in here
# only invited collaborators will be able to see your .env values

# reference these in your code with process.env.SECRET

PASSWORD=some_password_you_like
DROPBOX_ACCESS_TOKEN=some_long_access_token_here

# note: .env is a shell file so there can't be spaces around =
```

Now, within your Gradle project, you just need to configure a custom maven repo:
```
maven {
  credentials {
      username 'admin'
      password 'some_password_you_like'
  }
  url "https://yourproject.glitch.me/maven"
}
```
We recommend moving the username, password, and url out of the project itself and into a `gradle.properties` file in your home `.gradle` directory.

## Files
Your files are stored in Dropbox, under the folder `Apps/the-name-of-your-app/maven`. You can make backups, modify and delete files, and access the whole of your maven server within this folder structure.

Made with [glitch.com](https://glitch.com/)
-----------------

\ ゜o゜)ノ

## License

fetch is available under the MIT license. See the LICENSE file for more info.
