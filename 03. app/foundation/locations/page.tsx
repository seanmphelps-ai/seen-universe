    <div className="seenFlowHeader">
      <h1 className="seenDisplayLarge">Geographical Imprints</h1>
      <p className="seenFlowIntroduction">
        Tell us about the places that have been part of your journey.
      </p>
    </div>

    <div className="seenFlowForm">
      <div className="seenField">
        <label className="seenLabel">Where were you born?</label>
        <div className="seenInputFrame">
          <input
            type="text"
            placeholder="City, State / Country"
            value={form.born}
            onChange={(e) => updateField('born', e.target.value)}
            className="seenInput"
          />
        </div>
      </div>

      <div className="seenFieldset">
        <label className="seenLabel">Where have you lived for more than one year?</label>
        <div className="seenLocationList">
          {form.lived.map((location, index) => (
            <div key={index} className="seenLocationRow">
              <div className="seenInputFrame">
                <input
                  type="text"
                  placeholder="City, State / Country"
                  value={location}
                  onChange={(e) => updateLived(index, e.target.value)}
                  className="seenInput"
                />
              </div>
              {form.lived.length > 1 && (
                <button
                  onClick={() => removeLivedLocation(index)}
                  className="seenLocationRemove"
                >
                  −
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addLivedLocation} className="seenAddLocation">
          <span>+</span> Add another location
        </button>
      </div>

      <div className="seenField">
        <label className="seenLabel">Where do you live now?</label>
        <div className="seenInputFrame">
          <input
            type="text"
            placeholder="City, State / Country"
            value={form.current}
            onChange={(e) => updateField('current', e.target.value)}
            className="seenInput"
          />
        </div>
      </div>

      <button onClick={handleContinue} className="seenButtonPrimary">
        Continue
      </button>
    </div>

    <div className="seenDivider seenCompletionDivider" />
  </div>
</div>