//////
const Election = artifacts.require('./Election')

contract('Election', () => {
    let election
    let accounts

    beforeEach(async () => {
     accounts = await web3.eth.getAccounts()
     election = await Election.deployed({from: accounts[0]})
    });

    it('Makes initiator the manager', async() => {
        let manager = await election.manager()
        
        assert.equal(manager, accounts[0])
    })

    it('can add a candidate', async () => {
        await election.addCandidate(1,'RG',{from: accounts[0]})
        await election.uploadImage(1,'123','trump')
        const candidate1 = await election.candidates(1)
        assert.equal(candidate1.name, "RG")
        assert.equal(candidate1.voteCount, 0)
    })

    it('can register single voter', async () => {
        await election.register('Prakash',{from: accounts[1]})
        const voter1 = await election.voters(accounts[1])
        assert(voter1.exists)
        assert.equal(voter1.name, 'Prakash')
        assert(!voter1.voted)
    })

    it('can register multiple candidates and voters', async () => {
        await election.register('A',{from: accounts[2]})
        await election.register('B',{from: accounts[3]})

        await election.addCandidate(2,'NM',{from: accounts[0]})
        await election.uploadImage(2,'123','trump')
        await election.addCandidate(3,'AAP',{from: accounts[0]})
        await election.uploadImage(3,'123','trump')

        const voter2 = await election.voters(accounts[2])
        const voter3 = await election.voters(accounts[3]) 
        
        const candidate2 = await election.candidates(2)
        const candidate3 = await election.candidates(3)

       // assert.equal(voter1.name, 'Prakash')
        assert.equal(voter2.name, 'A')
        assert.equal(voter3.name, 'B')

        assert.equal(candidate2.name, 'NM')
        assert.equal(candidate3.name, 'AAP')
        
       // console.log(voter2.exists)
    })

     it('lets voters set passwords', async () =>{
        //await election.register('A',{from: accounts[1]})
        await election.setVoterPassword('Password',{from: accounts[1]})
        
        const voter1 = await election.voters(accounts[1])
        
        assert.equal(voter1.password, 'Password') 
    })  
    
    it('authenticates users', async () =>{
      // await election.register('A',{from: accounts[1]})
      // await election.setVoterPassword('Password',{from: accounts[1]})
        await election.authenticate(1,'Password',{from: accounts[1]})

        const voter1 = await election.voters(accounts[1])
        
        assert(voter1.authenticated) 
    })  
        
    it('voters can vote', async() => {
        
      //  await election.register('A',{from: accounts[1]})
      //  await election.setVoterPassword('Password1',{from: accounts[1]})
        await election.authenticate(1,'Password',{from: accounts[1]})

        //await election.register('B',{from: accounts[2]})
        await election.setVoterPassword('Password2',{from: accounts[2]})
        await election.authenticate(2,'Password2',{from: accounts[2]})

        //await election.register('A',{from: accounts[3]})
        await election.setVoterPassword('Password3',{from: accounts[3]})
        await election.authenticate(3,'Password3',{from: accounts[3]})

        await election.vote('1',{from: accounts[1]})
        await election.vote('1',{from: accounts[2]})
        await election.vote('2',{from: accounts[3]})
        
        let voter1 = await election.voters(accounts[1])
        let voter2 = await election.voters(accounts[2])
        let voter3 = await election.voters(accounts[3])
       
        const candidate1 = await election.candidates(1)
        const candidate2 = await election.candidates(2)
        const candidate3 = await election.candidates(3)

        // console.log(candidate1)
        // console.log(candidate2)

        assert(voter1.voted)
        assert(voter3.voted)
        assert(voter2.voted)

        assert.equal(candidate1.voteCount, '2')
        assert.equal(candidate2.voteCount, '1')
        assert.equal(candidate3.voteCount, '0')
        
        
    })
 
    it('can declare a winner', async () => {
        await election.finalizeResult({from: accounts[0]})
        
        let winner = await election.winner()
        assert.equal(winner.name, 'RG')
    })

    describe('Permissions Check', () => {

        it('Only manager can declare the winner', async () => {
            try{
                await election.finalizeResult({from: accounts[1]})
                assert(false)
            }
            catch (err){
                assert(err)
            }
        })

        // it('Only manager can add voters', async () => {
        //     try{
        //         await election.register(3, 'B',accounts[3], {from: accounts[1]})
        //         assert(false)
        //     }
        //     catch (err){
        //         assert(err)
        //     }
        // })

        it('Only manager can add candidates', async () => {
            try{
                await election.addCandidate(3, 'B',accounts[3], {from: accounts[1]})
                assert(false)
            }
            catch (err){
                assert(err)
            }
        })
        
        
    })

    describe('Image upload check', async () => {
        let result 
        let imageCount

        beforeEach(async () => {
            await election.addCandidate(4,'RG',{from: accounts[0]})
           
            result = await election.uploadImage(4,'abc123','biden',{from: accounts[0]})
            imageCount = await election.imageCount()
        })

        it('creates images', async () => {

            image = await election.images(1)
            //console.log(result.logs[0].args)
            const event = result.logs[0].args


            assert.equal(event.id.toNumber(), imageCount, 'id is correct')
            assert.equal(event.imghash, 'abc123', 'Hash is correct')
            assert.equal(event.description, 'biden', 'Description is correct')
        })

    })

} )

