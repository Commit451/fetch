# fetch

Private maven servers are complicated or pricey. fetch aims to make them simple and free. All you need to do is remix this project on glitch.com and do a bit of configuration.

## Configuration
To make things private, you need to add a username and password to the `.env` file in Glitch. It'll look a little something like this:
```
# Environment Config

# store your secrets and config variables in here
# only invited collaborators will be able to see your .env values

# reference these in your code with process.env.SECRET

USERNAME=blah
PASSWORD=blah

# note: .env is a shell file so there can't be spaces around =
```
Note that if you leave these blank, anyone will have read/write access to the maven artifacts.

Now, within your Gradle project, you just need to configure a custom maven repo:
```
maven {
  credentials {
      username "your_username"
      password "your_password"
  }
  url "https://yourproject.glitch.me"
}
```
We recommend moving the username, password, and url out of the project itself and into a `gradle.properties` file in your Gradle HOME directory.

## Limitataions
glitch.com limits you to a max of 128 MB of files. You can check how many you are using by visiting `https://yourprojectname.glitch.me/data`


Made with [glitch.com](https://glitch.com/)
-----------------

\ ゜o゜)ノ