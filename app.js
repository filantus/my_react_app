// window.ee = new EventEmitter();

const Component = React.Component;
const PropTypes = React.PropTypes;
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;
const createStore = Redux.createStore;

const sort_by_bool_and_str = function(a, b, bool_value, str_value) {
    const sort_by_val = function() {
        return a[str_value].toLowerCase() == b[str_value].toLowerCase()
        ? 0 : (a[str_value].toLowerCase() < b[str_value].toLowerCase()
        ? -1
        : 1);
    }
    if( a[bool_value] === b[bool_value] ){
        return sort_by_val();
    } else {
        if( a[bool_value] === true ){
            return -1;
        } else if( b[bool_value] === true ){
            return 1;
        } else {
            return sort_by_val();
        }
    }
}


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
        // console.log(this.props.isSuperSelected)
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
File.propTypes = {
  name: React.PropTypes.string.isRequired,
  size: React.PropTypes.number.isRequired,
  is_dir: React.PropTypes.bool.isRequired,
  created: React.PropTypes.string.isRequired,
}


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files_data: [],
            selectedItems: {},
            superSelectedItems: {},
        };

        axios.get('/files')
            .then(res => {
                console.log(res.data);
                this.setState({'files_data': res.data});
            });
    }

    onFileDoubleClick(e, name) {
        e.preventDefault();

        let nextState = {};
        if( e.ctrlKey )
          nextState = Object.assign({}, this.state.superSelectedItems);

        nextState[name] = !nextState[name];
        this.setState({superSelectedItems: nextState});
    }

    onFileClick(e, name) {
        e.preventDefault();

        let nextState = {};
        if( e.ctrlKey )
          nextState = Object.assign({}, this.state.selectedItems);

        nextState[name] = !nextState[name];
        this.setState({selectedItems: nextState});
    }

    render() {
        const files_data = this.state.files_data;
        const files = files_data.sort(function(a, b){return sort_by_bool_and_str(a, b, 'is_dir', 'name')}).map(function(item){
            return <File
                key={item.name}
                name={item.name}
                size={item.size}
                is_dir={item.is_dir}
                created={item.created}
                isSelected={this.state.selectedItems[item.name]}
                isSuperSelected={this.state.superSelectedItems[item.name]}
                onFileClick={(e, name)=>this.onFileClick(e, name)}
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


// Action
const increaseAction = { type: 'increase' }

// Reducer
function counter(state = { count: 0 }, action) {
  const count = state.count
  switch (action.type) {
    case 'increase':
      return { count: count + 1 }
    default:
      return state
  }
}

// Store
const store = createStore(counter)

// Map Redux state to component props
function mapStateToProps(state){
  return {
    value: state.count
  }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch){
  return {
    onIncreaseClick: () => dispatch(increaseAction)
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

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
)