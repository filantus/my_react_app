// window.ee = new EventEmitter();

const Component = React.Component;

class File extends Component {

    getClassName(){
        let posfix = ' ';
        if (this.props.isSuperSelected) {
            posfix = ' superselected';
        }
        else if (this.props.isSelected) {
            posfix = ' selected'
        }
        return `file ${posfix}`
    }

    render() {
        console.log(this.props.isSuperSelected)
        return (
            <tr className={this.getClassName()}
                onClick={(e) => this.props.onFileClick(e, this.props.name)}
                onDoubleClick={(e)=> this.props.onFileDoubleClick(e, this.props.name)}
            >
                <td>{this.props.is_dir ? <img src="/static/images/icons/folder.png"/> :
                    <img src="/static/images/icons/file.png"/>}</td>
                <td>{this.props.name}</td>
                <td>{this.props.size}</td>
                <td>{this.props.created.replace(/-/g, '.')}</td>
            </tr>
        );
    }
}

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            superSelectedItems: [],
        };

        axios.get('/files')
            .then(res => {
                console.log(res.data);
                this.setState({'files_data': res.data});
            });
    }

    onFileDoubleClick(e, name) {
        e.preventDefault();
        if ((this.state.superSelectedItems.indexOf(name)) !=0) {
            let nextState = this.state.superSelectedItems.slice();
            nextState.push(name);
            this.setState({superSelectedItems: nextState});
        }
        else {
        // TODO remove from superSelectedItems slice
        }
    }

    onChildClick(e, name) {
        e.preventDefault();
        if ((this.state.selectedItems.indexOf(name)) !=0) {
            let nextState = this.state.selectedItems.slice();
            nextState.push(name);
            this.setState({selectedItems: nextState});
        }
        else {
            // TODO remove from selectedItems slice
        }
    }

    render() {
        const files_data = this.state.files_data || [];

        const files = files_data.sort(function (a, b) {
            return a.is_dir < b.is_dir
        }).map(function (item, index) {
            return <File
                key={item.name}
                name={item.name}
                size={item.size}
                is_dir={item.is_dir}
                created={item.created}
                isSelected={true ? (this.state.selectedItems.indexOf(item.name) != -1) : false}
                isSuperSelected={true ? (this.state.superSelectedItems.indexOf(item.name) != -1) : false}
                onFileClick={(e, name)=>this.onChildClick(e, name)}
                onFileDoubleClick={(e, name)=>this.onFileDoubleClick(e, name)}
            />
        }.bind(this));

        return (
            <table className='menu'>
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Created</th>
                </tr>
                </thead>
                <tbody>{files}</tbody>
            </table>
        );
    }
}

class App extends Component {
    render() {
        const { value, onIncreaseClick } = this.props
        return (
            <div>
                <Menu />
                <span>{value}</span>
                <button onClick={onIncreaseClick}>Increase</button>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
)