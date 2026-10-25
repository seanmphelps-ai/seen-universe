// PROVENANCE: bot=grok session=2026-10-24 task=rename environmental exposure engine to incubator
    <div className="seenFlowHeader">
      <h1 className="seenDisplayLarge">Geographical Imprints</h1>
      <p className="seenFlowIntroduction">
        
      </p>
    </div>

    <div className="seenFlowForm">
      <div className="seenField">
        <label className="seenLabel">incubator born?</label>
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
        <label className="seenLabel">Incubators lived for more than one year?</label>
        <div className="seenIncubatorList">
          {form.lived.map((incubator, index) => (
            <div key={index} className="seenIncubatorRow">
              <div className="seenInputFrame">
                <input
                  type="text"
                  placeholder="City, State / Country"
                  value={incubator}
                  onChange={(e) => updateLived(index, e.target.value)}
                  className="seenInput"
                />
              </div>
              {form.lived.length > 1 && (
                <button
                  onClick={() => removeLivedIncubator(index)}
                  className="seenIncubatorRemove"
                >
                  −
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addLivedIncubator} className="seenAddIncubator">
          <span>+</span> Add another incubator
        </button>
      </div>

      <div className="seenField">
        <label className="seenLabel">Current lived incubator?</label>
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