import { GithubUser } from "./github.js"

export class Favorities {
  constructor() {
    this.root = document.querySelector('#app')
    this.tbody = this.root.querySelector('tbody')
    this.trEmpty = this.root.querySelector('.user-empty')
    this.load()
  }
  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error("Usuário já favoritado.")
      }

      const githubUser = await GithubUser.search(username)

      if (githubUser.login === undefined) {
        throw new Error("Usuário não encontrado.")
      }

      this.entries = [githubUser, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    this.entries = this.entries
      .filter(entry => entry.login !== user.login)

    this.update()
    this.save()
  }
}

export class FavoritiesView extends Favorities {
  constructor() {
    super()
    this.update()
    this.addUser()
  }
  update() {
    this.removeTrUser()
    this.removeEmptyUser()

    if (this.entries == '') {
      this.showEmptyUser()
    }

    this.entries.forEach(user => {
      const row = this.createTrUser()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = `${user.name}`
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = `${user.public_repos}`
      row.querySelector('.followers').textContent = `${user.followers}`

      row.querySelector('button').onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar esse usuário?")
        if (isOk) {
          this.delete(user)
        }
      }
    })

    this.addUser()
  }

  addUser() {
    const buttonFav = this.root.querySelector('header button')
    buttonFav.onclick = () => {
      const { value } = this.root.querySelector('header input')
      this.add(value)
    }
  }

  removeTrUser() {
    this.tbody.querySelectorAll('.user').forEach(trUser => trUser.remove())
  }

  createTrUser() {
    const trUser = document.createElement('tr')
    this.tbody.appendChild(trUser)
    trUser.classList.add('user')

    trUser.innerHTML =
      `
        <td>
          <div class="user-wrapper">
            <img src="https://github.com/kojirenan.png" alt="">
            <a href="https://github.com/kojirenan" target="_blank">
              <p>Renan Koji</p>
              <span>/kojirenan</span>
            </a>
          </div>
        </td>
        <td class="repositories">132</td>
        <td class="followers">10</td>
        <td>
          <button>Remover</button>
        </td>
      `
    return trUser
  }

  removeEmptyUser() {
    this.trEmpty.classList.add("hide")
  }

  showEmptyUser() {
    this.trEmpty.classList.remove("hide")
  }
}