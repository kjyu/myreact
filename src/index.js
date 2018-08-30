import React from './react'
import ReactDOM from './react-dom'

class Demo1 extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            arr1: ['alice', 'emily','ana','jans']
        }
    }
    render() {
        return (
            <div className="App">
            {
                this.state.arr1.map(
                    function(name, index) {
                        return <div key={index}> Hello, {name}!</div>
                    } 
                )
            }
            </div>
        )
    }
}

class Demo2 extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            arr1:[
                <h1 key="1">Hello world!</h1>,
                <h2 key="2">React is awesome</h2>,
            ]
        }
    }

    render() {
        return (
            <div>
            {
                this.state.arr1
            }
            </div>
        )
    }
}

class Demo5 extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            arr1:[
                <h1 key="1">Hello world!</h1>,
                <h2 key="2">React is awesome</h2>,
            ]
        }
    }

    render() {
        return (
            <div>
            {
                this.state.arr1
            }
            </div>
        )
    }
}

class App extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            num: 0
        }
    }

    onClick() {
        //这个函数再子标签中调用需要绑定
        //https://blog.csdn.net/sinat_17775997/article/details/56839485
        this.setState( { num: this.state.num + 1 } );
    }

    componentDidMount() {
        console.log('did mount');
        for (let i = 0; i < 100; i++) {
            // this.setState(prevState => {
            //     console.log(prevState.num);
            //     return {
            //         num: prevState.num + 1
            //     }
            // })
            this.setState({num: this.state.num + 1})
            console.log(this.state.num);
        }
    }

    componentDidUpdate() {
        console.log('did update');
    }

    render() {
        return (
            <div className="App" style={{flex:1,font:12}}>
                {/* <h1>{this.state.num}</h1> */}
                <h1 onClick={()=>this.onClick()}>箭头函数{this.state.num}</h1>
                {/*<h1 onClick={this.onClick.bind(this)}>bind(){this.state.num}</h1>*/}
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById( 'root' )
);