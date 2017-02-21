// window.ee = new EventEmitter();

const Component = React.Component;
const PropTypes = React.PropTypes;
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;
const createStore = Redux.createStore;


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






class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected,
    };
  }
  onClick(event, react_event){
    event.preventDefault();
    this.props.onClick(this.props.name, !this.props.selected, event.ctrlKey);
  }
  onDoubleClick(event, react_event){
    event.preventDefault();
    console.log(111);
    alert(DoubleClick);
  }
  render(){
    let classNames = `file${this.state.selected ? ' selected': ''}`;
    return (
        <tr className={classNames} onClick={this.onClick.bind(this)} onDoubleClick={() => alert('hi!')}>
          <td>{this.props.is_dir ? <img src="/static/images/icons/folder.png" />: <img src="/static/images/icons/file.png" />}</td>
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
      selections: [],
    };

    axios.get('http://localhost/files')
      .then(res => {
        console.log(res.data);
        this.setState({'files_data': res.data});
      });
  }
  onChildClick(id, selected, append){
    var selections = append ? this.state.selections : [];

    selections[id] = selected;

    this.setState({
        selections: selections
    });
  }
  render(){
    const files_data = this.state.files_data || [];

    const files = files_data.sort(function(a, b) {return a.is_dir < b.is_dir}).map(function(item, index){
      return <File
        key={index+Math.random()}
        name={item.name}
        size={item.size}
        is_dir={item.is_dir}
        created={item.created}
        selected={this.state.selections[item.name]}
        onClick={this.onChildClick.bind(this)}
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
  render(){
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

App.propTypes = {
  value: PropTypes.number.isRequired,
  onIncreaseClick: PropTypes.func.isRequired
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
)