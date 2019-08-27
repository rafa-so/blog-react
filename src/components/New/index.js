import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import firebase from '../../firebase';

import './new.css'

class New extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titulo: "",
            imagem: null,
            url: '',
            descricao: "",
            alert: '',
            progress: 0
        };

    this.cadastrar = this.cadastrar.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    }

    componentDidMount(){
        if (!firebase.getCurrent()) {
            this.props.history.replace('/login');
            return null;
        }
    }

    handleFile = async(e) => {
        if (e.target.files[0]) {
            const imagem = e.target.files[0];
            if (imagem.type === 'image/png' || imagem.type === 'image/jpeg') {
                await this.setState({ imagem: imagem });
                this.handleUpload();
            } else {
                alert('Envie uma imagem PNG ou JPEG.');
                this.setState({ imagem: null });
                return null;
            }
        }
    }

    handleUpload = async () => {
        const { imagem } = this.state;
        const uid = firebase.getCurrentUid();

        const uploadTask = firebase.storage
            .ref(`imagens/${uid}/${imagem.name}`)
            .put(imagem);

        await uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.setState({ progress: progress });
        },
        (error) => {
            console.log('error: ' + error);
        },
        () => {
            firebase.storage.ref(`imagens/${uid}`)
            .child(imagem.name).getDownloadURL()
            .then((url) => {
                this.setState({ url: url });
                console.log('url: ' + url);
            });
        });
    }

    cadastrar = async(e) => {
        e.preventDefault();

        const { titulo, imagem, descricao, url } = this.state;
        
        if (titulo !== '' && 
            imagem !== '' && 
            descricao !== '' &&
            imagem !== null &
            url !== '') {

            let posts = firebase.db.ref('posts');
            let chave = posts.push().key;
            await posts.child(chave).set({
                titulo: titulo,
                imagem: url,
                descricao: descricao,
                autor: localStorage.nome
            });

            this.props.history.push('/dashboard')
        } else {
            this.setState({ alert: 'Todos os campos obrigatórios!' });
        }
    }

    render() {
        return(
            <div>
                <header id="new">
                    <Link to="/dashboard">Voltar</Link>
                </header>
                <form onSubmit={ this.cadastrar } id="new-post">
                    <span> { this.state.alert } </span>
                    
                    <input type="file"
                        onChange={ this.handleFile }/>
                    { this.state.url !== '' ?
                        <img src={ this.state.url } width="250" 
                            height="250" alt="Capa do post" />
                        :
                        <progress value={ this.state.progress } max="100" />
                    }

                    <label>Título: </label>
                    <input type="text" placeholder="Nome do post" 
                        value={ this.state.titulo } autoFocus
                        onChange={ (e) => this.setState({ titulo: e.target.value }) }/>
                    
                    <label>Descrição: </label>
                    <textarea type="text" placeholder="Descrição do post" 
                        value={ this.state.descricao }
                        onChange={ (e) => this.setState({ descricao: e.target.value }) }/>
                    
                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        );
    }
}

export default withRouter(New);