// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.13;


contract IMF {  
    // Eventos  
    event CasoRegistrado(uint indexed casoId, string descricao, address autor);  
    event VotoRegistrado(uint indexed casoId, address juiz, bool decisao);  
    event CasoResolvido(uint indexed casoId, bool resultado);  

    struct Caso {  
        string descricao;  
        address autor;  
        bool resolvido;  
        bool resultado;  
        uint votosPositivos;  
        uint votosNegativos;  
        mapping(address => bool) juizes;  
        mapping(address => bool) votou;  
    }  

    Caso[] public casos;  
    mapping(address => bool) public juizes; // Lista de juízes autorizados  

    // Modificador: só juízes podem votar  
    modifier apenasJuiz() {  
        require(juizes[msg.sender], "Apenas juizes podem votar");  
        _;  
    }  

    // Registrar novo caso (como antes)  
    function registrarCaso(string memory _descricao) public {  
        uint casoId = casos.length;  
        Caso storage novoCaso = casos.push();  
        novoCaso.descricao = _descricao;  
        novoCaso.autor = msg.sender;  
        emit CasoRegistrado(casoId, _descricao, msg.sender);  
    }  

    // Adicionar juiz (apenas dono do contrato)  
    function adicionarJuiz(address _juiz) public {  
        juizes[_juiz] = true;  
    }  

    // Votar em um caso  
    function votar(uint _casoId, bool _decisao) public apenasJuiz {  
        Caso storage caso = casos[_casoId];  
        require(!caso.votou[msg.sender], "Juiz ja votou");  

        caso.votou[msg.sender] = true;  
        if (_decisao) {  
            caso.votosPositivos++;  
        } else {  
            caso.votosNegativos++;  
        }  

        emit VotoRegistrado(_casoId, msg.sender, _decisao);  

        // Se 3 votos foram alcançados, encerra o caso  
        if (caso.votosPositivos + caso.votosNegativos >= 3) {  
            caso.resolvido = true;  
            caso.resultado = caso.votosPositivos > caso.votosNegativos;  
            emit CasoResolvido(_casoId, caso.resultado);  
        }  
    }  
}  

