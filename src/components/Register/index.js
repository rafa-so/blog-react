import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './register.css'

import firebase from '../../firebase';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nome: '',
            email: '',
            senha: ''
        };

        this.register = this.register.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }

    register(e){
        e.preventDefault();
        this.onRegister();

    }

    onRegister = async() => {
        try {
            const { nome, email, senha } = this.state;

            await firebase.register(nome, email, senha);
            this.props.history.replace("/dashboard");

        } catch (error) {
            alert(error.message);
        }
    }

    render(){
        return(
            <div>
                <h1 className="register-h1">Novo usuário</h1>

                <form onSubmit={ this.register } id="register">
                    <label>Nome: </label>
                    <input type="text" value={ this.state.nome } 
                        autofocus autoComplete="off"
                        onChange={(e)=>this.setState({nome: e.target.value})} 
                        placeholder="Rafael Oliveira" />
                    
                    <label>Email: </label>
                    <input type="email" value={ this.state.email } autoComplete="off"
                        onChange={(e)=>this.setState({email: e.target.value})} 
                        placeholder="teste@teste.com" />
                    
                    <label>Senha: </label>
                    <input type="password" value={ this.state.senha } autoComplete="off"
                        onChange={(e)=>this.setState({senha: e.target.value})} 
                        placeholder="123123" />
                    
                    <button type="submit">Cadastrar</button>

                </form>
            </div>
        );
    }
}

export default withRouter(Register);