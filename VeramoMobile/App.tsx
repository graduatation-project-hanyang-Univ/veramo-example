import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, View, Text, Button} from 'react-native'

// Import agent from setup
import {agent} from './src/veramo/setup'

interface Identifier {
    did: string
}

const App = () => {
    const [identifiers, setIdentifiers] = useState<Identifier[]>([])

    // Add the new identifier to state
    const createIdentifier = async () => {
        const _id = await agent.didManagerCreate()

        setIdentifiers((s) => s.concat([_id]))
    }

    // Check for existing identifers on load and set them to state
    useEffect(() => {
        const getIdentifiers = async () => {
            const _ids = await agent.didManagerFind()
            setIdentifiers(_ids)

            // Inspect the id object in your debug tool
            console.log('_ids:', _ids)

            //resolve
            const didDoc = await agent.resolveDid({
                didUrl: 'did:ethr:rinkeby:0x0327bfaeaf5ec200d82d41c551671450c11d9c1294407c70f207ed114db0ea9452',
            })
            console.log('resolve')
            console.log(JSON.stringify(didDoc, null, 2))

            //selective disclosure
            const msg = await agent.handleMessage({
                raw: 'https://id.uport.me/req/eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE2MzIxMjc5MDYsImV4cCI6MTYzMjEyODUwNiwicGVybWlzc2lvbnMiOlsibm90aWZpY2F0aW9ucyJdLCJjYWxsYmFjayI6Imh0dHBzOi8vN2E5OS0xNzUtMjIzLTQ5LTE5OC5uZ3Jvay5pby91cG9ydHMvd2ViaG9va3MvaXNzdWFuY2UiLCJ0eXBlIjoic2hhcmVSZXEiLCJpc3MiOiJkaWQ6ZXRocjoweDFhMmM4ZTQwN2JhNjc4OTdiMzkzMzdkZmM2OTJhZDIxNjMzYTM4OTIifQ.kGVUCMGCypNT1VIZSO6Xvrgq57iEeett1Eabl2REaTQAHuYzTbT5Tm8wqjmpXGGF6g9tvE8SNqklajVIHTZsCgE?callback_type=post',
            });

            console.log(msg)
        }

        getIdentifiers()
    }, [])

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{padding: 20}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>Identifiers</Text>
                    <View style={{marginBottom: 50, marginTop: 20}}>
                        {identifiers && identifiers.length > 0 ? (
                            identifiers.map((id: Identifier) => (
                                <View key={id.did}>
                                    <Text>{id.did}</Text>
                                </View>
                            ))
                        ) : (
                            <Text>No identifiers created yet</Text>
                        )}
                    </View>
                    <Button onPress={() => createIdentifier()} title={'Create Identifier'}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default App