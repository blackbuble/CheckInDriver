const rewire = require("rewire")
const index = rewire("./index")
const Inbox = index.__get__("Inbox")

const mapStateToProps = index.__get__("mapStateToProps")
// @ponicode
describe("componentDidMount", () => {
    let object
    let inst

    beforeEach(() => {
        object = [["George", "Pierre Edouard", "Pierre Edouard"], ["Edmond", "George", "Michael"], ["Edmond", "Edmond", "Anas"]]
        inst = new Inbox(object)
    })

    test("0", () => {
        let callFunction = () => {
            inst.componentDidMount()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("componentWillUnmount", () => {
    let object
    let inst

    beforeEach(() => {
        object = [["Michael", "Pierre Edouard", "Anas"], ["Pierre Edouard", "Anas", "Michael"], ["Pierre Edouard", "George", "Jean-Philippe"]]
        inst = new Inbox(object)
    })

    test("0", () => {
        let callFunction = () => {
            inst.componentWillUnmount()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("handleBackButtonClick", () => {
    let object
    let inst

    beforeEach(() => {
        object = [["George", "Anas", "Edmond"], ["Michael", "Jean-Philippe", "Jean-Philippe"], ["Edmond", "George", "Jean-Philippe"]]
        inst = new Inbox(object)
    })

    test("0", () => {
        let callFunction = () => {
            inst.handleBackButtonClick()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("mapStateToProps", () => {
    test("0", () => {
        let callFunction = () => {
            mapStateToProps({ user: "username" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            mapStateToProps({ user: "user_name" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            mapStateToProps({ user: "user-name" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            mapStateToProps({ user: "user123" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            mapStateToProps({ user: 123 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            mapStateToProps(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
