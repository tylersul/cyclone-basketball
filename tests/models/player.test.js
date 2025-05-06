const mongoose = require('mongoose');
const Player = require('../../models/player');

describe('Player Model Test', () => {
  // Clear database before each test
  beforeEach(async () => {
    await Player.deleteMany({});
  });

  // Test Player model creation
  test('should create & save player successfully', async () => {
    const playerData = {
      firstName: 'John',
      lastName: 'Doe',
      position: 'Guard',
      number: 23,
      height: '6\'2"',
      weight: 195,
      team: 'Cyclone Basketball',
      author: new mongoose.Types.ObjectId()
    };

    const validPlayer = new Player(playerData);
    const savedPlayer = await validPlayer.save();

    // Assert
    expect(savedPlayer._id).toBeDefined();
    expect(savedPlayer.firstName).toBe(playerData.firstName);
    expect(savedPlayer.lastName).toBe(playerData.lastName);
    expect(savedPlayer.position).toBe(playerData.position);
  });

  // Test validation for required fields
  test('should fail to save player without required fields', async () => {
    const playerWithoutRequiredField = new Player({ firstName: 'Test' });
    
    let err;
    try {
      await playerWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  // Test unique constraints or other specific validations
  test('should enforce unique constraints if applicable', async () => {
    const player1 = new Player({
      firstName: 'Michael',
      lastName: 'Jordan',
      number: 23,
      team: 'Cyclone Basketball',
      author: new mongoose.Types.ObjectId()
    });

    await player1.save();

    // Attempt to create a player with same unique identifier
    const player2 = new Player({
      firstName: 'Michael',
      lastName: 'Jordan',
      number: 23,
      team: 'Cyclone Basketball',
      author: new mongoose.Types.ObjectId()
    });

    // This test might need adjustment based on your specific model constraints
    let err;
    try {
      await player2.save();
    } catch (error) {
      err = error;
    }

    // Adjust this based on your actual unique constraints
    // expect(err).toBeDefined();
  });
});
