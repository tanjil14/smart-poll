import React from 'react';
import shortid from 'shortid';
import { Container,Row,Col } from 'reactstrap';
import POLLS from './poll-data/polls.js';
import Sidebar from './sidebar';
import MainComponent from './main-components';

class App extends React.Component{
    state={
        polls:[],
        selectedPolls:{},
        searchTerm:''
    }
  //life cycle method

  componentDidMount(){
      this.setState({polls:POLLS})
  };

  //Create a new poll

  addNewPoll=poll=>{
      poll.id=shortid.generate()
      poll.created=new Date()
      poll.totalVote=0
      poll.opinions=[]

      this.setState({
          polls:this.state.polls.concat(poll)
      })
  };

  //Update Poll

  updatePoll=updatePoll=>{
      const polls=[...this.state.polls];
      const poll=polls.find(p=>p.id==updatePoll.id);

      poll.title=updatePoll.title;
      poll.description=updatePoll.description;
      poll.opinions=updatePoll.opinions;

      this.setState({polls})
  };

 // Delete poll

 deletePoll=pollId=>{
     const polls=this.state.polls.filter(p=>p.id!=pollId)
     this.setState({polls,selectedPolls:{}})
 }

//selectPoll

selectPoll=pollId=>{
    const poll=this.state.polls.find(p=>p.id==pollId)
    this.setState({selectedPolls:poll});
}

//handle Search

handleSearch=searchValue=>{     //not state searchTerm just function parameter
this.setState({searchTerm:searchValue})
};

performSearch=()=>{
    return this.state.polls.filter(poll=>poll.title.toLowerCase().includes(this.state.searchTerm.toLowerCase())
    );
}

getOpinion=response=>{
    const {polls}=this.state
    const poll=polls.find(p=>p.id==response.pollId);
    const option =poll.options.find(
        o=>o.id==response.selectedOption
    );
    poll.totalVote++;
    option.vote++;
    const opinion={
        id:shortid.generate(),
        name:response.name,
        selectedOption:response.selectedOption
    };

    poll.opinions.push(opinion);
    this.setState({polls});
};

    render(){
        const polls=this.performSearch()
        return(
           <Container className='my-5'>
           <Row>
           <Col md={4}>
           <Sidebar 
           polls={polls}  //pass render local array
           searchTerm={this.state.searchTerm}
           selectPoll={this.selectPoll}
           handleSearch={this.handleSearch}
           addNewPoll={this.addNewPoll }
           />
           </Col>

           <Col md={8}>
           <MainComponent
           poll={this.state.selectedPolls}
           getOpinion={this.getOpinion}
           updatePoll={this.updatePoll}
           deletePoll={this.deletePoll}
           />
           </Col>
           </Row>
           </Container>
        )
    }
}

export default App;