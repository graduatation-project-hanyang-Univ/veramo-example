import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, Button } from 'react-native'

// Import agent from setup
import { agent } from './src/veramo/setup'

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
        }

        getIdentifiers()
    }, [])

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Identifiers</Text>
                    <View style={{ marginBottom: 50, marginTop: 20 }}>
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
                    <Button onPress={() => createIdentifier()} title={'Create Identifier'} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default App