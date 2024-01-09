#include <eosio/eosio.hpp>
#include <eosio/multi_index.hpp>
#include <eosio/action.hpp>
#include <eosio/transaction.hpp>
#include <eosio/asset.hpp>
#include <eosio/crypto.hpp>
#include <eosio/time.hpp>


using namespace eosio;
using std::string;
using std::vector;

name tokencontract = name("eosio.token");


CONTRACT dao : public eosio::contract {
 public:
  dao( name receiver, name code, datastream<const char*> ds ):
    contract(receiver, code, ds),
    _vote(receiver, receiver.value),
    _users(receiver, receiver.value)
    {}


    [[eosio::on_notify("eosio.token::transfer")]]
    void transfertoken(name from,name to, asset quantity, string memo){
        auto itr_users = _users.find(from.value);
        if ( itr_users == _users.end() ) { return; } ;
        for  ( int i = 0; i < itr_users->votes.size() ; i++ ) {
            
            _users.modify(itr_users, get_self(), [&](auto& row) {
                row.votes[i]._votes -= quantity.amount;
            });
        } 
    }




    ACTION createvote(name username, string header, string description,vector<string> votes){
        require_auth(username);

        vector <votes_struct> votes_struct = {};

        for(int i = 0; i < votes.size(); i++ ) {
            votes_struct.push_back({
                ._name = votes[i],
                ._votes = 0
            });
        }
        auto itr_vote = _vote.end();
        uint64_t num = itr_vote->num ? itr_vote->num + 1 : 0;
        _vote.emplace(username, [&](auto& row) {
            row.num = num;
            row.header = header;
            row.description = description;
            row.creator = username;
            row.votes = votes_struct;
        });
    };

    ACTION editvote(name username, uint64_t id, string header, string description,vector<string> votes){
        require_auth(username);
        auto itr_vote = _vote.find(id);
        check (itr_vote->creator == username,"Identification error");

        vector <votes_struct> votes_struct = {};

        for(int i = 0; i < votes.size(); i++ ) {
            votes_struct.push_back({
                ._name = votes[i],
                ._votes = 0
            });
        }

        _vote.modify(itr_vote, username, [&](auto& row) {
            row.header = header;
            row.description = description;
            row.votes = votes_struct;
        });
    };

    ACTION aprovevote(uint64_t num,uint64_t _end) {
        require_auth(get_self());
        auto itr_vote = _vote.find(num);
        _vote.modify(itr_vote, get_self(),[&](auto& row) {
            row.aprove = true;
            row._end = _end;
        });
    };

    ACTION delvote(uint64_t num) {
        require_auth(get_self());
        auto itr_vote = _vote.find(num);
        _vote.erase(itr_vote);
    };

    ACTION setvots(name username, uint64_t vote_id, uint64_t votes, string vote_name) {
        require_auth(username);
        
        //check token balance
        balance_u balance = get_assets(username);
        auto itr_tokens = balance.begin();
        check ( votes <= itr_tokens->balance.amount,"token amount error");

        auto itr_user = _users.find(username.value);
        if ( itr_user == _users.end() ) {
            vector<users_struct> users_struct;
            users_struct.push_back({
                ._name = vote_name,
                ._votes = votes,
                ._vote_id = vote_id
            });
            
            _users.emplace(username, [&](auto& row) {
                row.username = username;
                row.votes = users_struct;
            });
        } else {
            bool cheched = false;
            for ( int i = 0; i < itr_user->votes.size() ; i++ ) {
                if ( vote_id == itr_user->votes[i]._vote_id && vote_name == itr_user->votes[i]._name ) {
                    check ( (votes + itr_user->votes[i]._votes) <= itr_tokens->balance.amount,"token amount error" );
                    _users.modify(itr_user, username, [&](auto& row) {
                        row.votes[i]._votes += votes;
                    });
                    cheched = true;
                    break;
                }
            }
            if ( cheched == false ) {
                _users.modify(itr_user, username, [&](auto& row) {
                    row.votes.push_back({
                        ._name = vote_name,
                        ._votes = votes,
                        ._vote_id = vote_id
                    });
                });
            }
        }



        auto itr_vote = _vote.require_find(vote_id,"Identification error");
        bool vote_true;
        for ( int i = 0; i< itr_vote->votes.size();i++ ) {
            if  ( vote_name == itr_vote->votes[i]._name ) {
                
                _vote.modify(itr_vote,username, [&](auto& row) {
                    row.votes[i]._votes += votes;
                });

                vote_true = true;
                break;
            }
        }
        check ( vote_true == true,"vote_name error");
        
        require_recipient(username);
    };

 private:

    struct votes_struct
    {   
        string _name;
        uint64_t _votes;
    };

    struct users_struct
    {   
        uint64_t _vote_id;
        string _name;
        uint64_t _votes;
    };


    struct  account_table {
        asset    balance;

        uint64_t primary_key()const { return balance.symbol.code().raw(); }
    };

    typedef multi_index <name("accounts"), account_table> balance_u;

    TABLE user {
        name username;
        vector<users_struct> votes;

        auto primary_key() const { return username.value; }
      };

    typedef multi_index<name("users"), user> users;
    users _users;


    TABLE vote {
        uint64_t num;
        name creator;
        string header;
        string description;
        vector<votes_struct> votes;
        bool aprove;
        uint64_t _end;

        auto primary_key() const { return num; }
      };
    typedef multi_index<name("votes"), vote> votes;
    votes _vote;

    balance_u get_assets(name username) {
        return balance_u(tokencontract, username.value);
    }
};