Feature: Student Management API tests

  Background:
    * url baseUrl

  Scenario: Health check returns UP
    Given path 'health'
    When method get
    Then status 200
    And match response == { status: 'UP' }

  Scenario: Get all students returns a list
    Given path 'api', 'students'
    When method get
    Then status 200
    And match response == '#[]'
    And match each response contains { id: '#number', name: '#string', rollNo: '#string' }

  Scenario: Add a new student and fetch it by id
    Given path 'api', 'students'
    And request { name: 'Test Student', rollNo: '22CS099', branch: 'CSE', year: 3 }
    When method post
    Then status 201
    And match response.name == 'Test Student'
    * def newId = response.id

    Given path 'api', 'students', newId
    When method get
    Then status 200
    And match response.rollNo == '22CS099'

  Scenario: Adding a student without name is rejected
    Given path 'api', 'students'
    And request { rollNo: '22CS100' }
    When method post
    Then status 400
    And match response.error == 'name and rollNo are required'

  Scenario: Unknown student returns 404
    Given path 'api', 'students', 9999
    When method get
    Then status 404
