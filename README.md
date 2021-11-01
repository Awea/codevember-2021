# Codevember 2021

My contribution for codevember 2021.

- - -

## 📝 Table of contents
- [**Prerequisites**](#prerequisites)
- [**Commands**](#commands)
- [**Project structure**](#project-structure)
- [**Author**](#author)
- [**License**](#license)

- - -

<a name="prerequisites"></a>
## ⚙️ Prerequisites
- [**asdf**](https://github.com/asdf-vm/asdf)
- [**Make**](https://www.gnu.org/software/make/)
- [**Node.js**](https://nodejs.org)

<a name="commands"></a>
## ⌨️ Commands
### Serve
```makefile
## Serve latest src/*.js at http://localhost:3000 with hot reloading

make
```

💡 This command will also **install dependencies** on first run and when `package.json` or `package-lock.json` files are updated.

### Build
```makefile
## Build site for production use

make build
```

💡 This command will also **install dependencies** on first run and when `package.json` or `package-lock.json` files are updated.

### Deploy
```makefile
## Deploy site to https://codevember.davidauthier.wearemd.com/2021/11/

make deploy
```

#### Configuration
Before running this command you need to create an `.env` file at the root of the repo:

```bash
USER:=user
SERVER:=server
SERVER_DEST:=server_dest
```

### Help
```makefile
## List available commands

make help
```

<a name="project-structure"></a>
## 🗄️ Project structure
```
.
├── site               # SITE BUILD DESTINATION FOLDER
│    └── assets        # Various assets
│
├── src                # JavaScript source files
│
├── .gitignore        # Files and folders ignored by Git
├── .tool-versions    # Which version to use locally for each language, used by asdf
├── LICENSE           # License
├── Makefile          # Commands for this project
├── package.json      # JavaScript dependencies, used by NPM
└── package-lock.json # Tracking exact versions for JavaScript dependencies, used by NPM
└── README.md         # Project documentation
```

<a name="author"></a>
## ✍️ Author
[**@Awea**](https://github.com/Awea)

<a name="license"></a>
## 📄 License
**Codevember 2021** is licensed under the [GNU General Public License v3.0](LICENSE).
