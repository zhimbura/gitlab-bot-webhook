class GitResponse {
    static _fakeCash = new Set()
    constructor (database) {
        this.messages = []
        this.db = database
        this.projectName = null
        this.projectNameSpace = null
        this.branches = []
        this.chatsIds = []
        this._dbProject = null
    }

    async createData (project, nameSpace) {
        this.projectName = project
        this.projectNameSpace = nameSpace
        this._dbProject = await this.db.Project.get(this.projectName, this.projectNameSpace)
        let db_chats_id = await this.db.ChatProject.getChatsId(this._dbProject)
        for (let id of db_chats_id) {
            let chat = await this.db.Chat.getChatById(id)
            if (chat) {
                this.chatsIds.push({
                    id: chat.telegramChatId,
                    stepsIncluded: chat.stepsIncluded
                })
            }
        }

    }

    async addBranch (branch) {
        if (this._dbProject) {
            try {
                let db_branch = await this.db.Branch.getByProject(branch, this._dbProject)
                let db_subscribes = await this.db.Subscribe.getAllByBranchId(db_branch.id)
                for (let subscribe of db_subscribes) {
                    let chat = await this.db.Chat.getChatById(subscribe.chatId)
                    if (chat) {
                        let index = this.chatsIds.findIndex(c => c.id === chat.id)
                        if (index) {
                            this.chatsIds.push({
                                id: chat.telegramChatId,
                                stepsIncluded: chat.stepsIncluded
                            })
                        }
                    }
                }
            }catch (err) {
                console.log(err)
            }
        }
    }

    getChats () {
        return this.chatsIds.slice()
    }

    getMessage () {
        return this.messages.join('\n')
    }

    addMessage (message) {
        if (!~this.messages.indexOf(message)) {
            return this.messages.push(message)
        }
        return null
    }

    hasCash (value) {
        return GitResponse._fakeCash.has(value)
    }
    addCash (value, live = 0) {
        GitResponse._fakeCash.add(value)
        if (live) {
            setTimeout(() => {
                GitResponse._fakeCash.delete(value)
            }, live)
        }
    }
}

module.exports = GitResponse
